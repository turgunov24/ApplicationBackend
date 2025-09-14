import { Request, Response, NextFunction } from 'express';
import { policyService } from '../policy/service';
import {
	PolicyResources,
	PolicyActions,
	PolicyPossession,
} from '../policy/types';
import { generateErrorMessage } from '../utils/generateErrorMessage';
import { logger } from '../utils/logger';

/**
 * Middleware factory to check permissions for specific resource and action
 */
export const checkPermission = (
	resource: PolicyResources,
	action: PolicyActions,
	possession: PolicyPossession = PolicyPossession.ANY
) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			// Check if user is authenticated (should be called after parseUserFromToken)
			if (!req.user) {
				return res
					.status(401)
					.json(generateErrorMessage('Authentication required'));
			}

			// Check if user has any roles
			if (!req.user.roles || req.user.roles.length === 0) {
				return res
					.status(403)
					.json(generateErrorMessage('No roles assigned to user'));
			}

			// Check permission using policy service
			const permissionResult = policyService.checkPermission(
				req.user,
				resource,
				action,
				possession
			);

			if (!permissionResult.granted) {
				logger.warn(
					`Permission denied for user ${req.user.username} on ${resource}:${action}:${possession}`
				);
				return res
					.status(403)
					.json(
						generateErrorMessage(
							`Access denied: insufficient permissions for ${action} on ${resource}`
						)
					);
			}

			// Store permission result in request for potential use in handlers
			req.permission = permissionResult;

			next();
		} catch (error) {
			logger.error('Error checking permission:', error);
			return res
				.status(500)
				.json(
					generateErrorMessage('Internal server error during permission check')
				);
		}
	};
};

/**
 * Middleware to check if user can access their own resources
 */
export const checkOwnResourcePermission = (
	resource: PolicyResources,
	action: PolicyActions
) => {
	return checkPermission(resource, action, PolicyPossession.OWN);
};

/**
 * Middleware to check if user can access any resources
 */
export const checkAnyResourcePermission = (
	resource: PolicyResources,
	action: PolicyActions
) => {
	return checkPermission(resource, action, PolicyPossession.ANY);
};

/**
 * Middleware to check multiple permissions (user needs ALL permissions)
 */
export const checkMultiplePermissions = (
	permissions: Array<{
		resource: PolicyResources;
		action: PolicyActions;
		possession?: PolicyPossession;
	}>
) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			if (!req.user) {
				return res
					.status(401)
					.json(generateErrorMessage('Authentication required'));
			}

			if (!req.user.roles || req.user.roles.length === 0) {
				return res
					.status(403)
					.json(generateErrorMessage('No roles assigned to user'));
			}

			// Check all permissions
			for (const permission of permissions) {
				const result = policyService.checkPermission(
					req.user,
					permission.resource,
					permission.action,
					permission.possession || PolicyPossession.ANY
				);

				if (!result.granted) {
					logger.warn(
						`Permission denied for user ${req.user.username} on ${permission.resource}:${permission.action}`
					);
					return res
						.status(403)
						.json(
							generateErrorMessage(
								`Access denied: insufficient permissions for ${permission.action} on ${permission.resource}`
							)
						);
				}
			}

			next();
		} catch (error) {
			logger.error('Error checking multiple permissions:', error);
			return res
				.status(500)
				.json(
					generateErrorMessage('Internal server error during permission check')
				);
		}
	};
};

/**
 * Middleware to check if user has at least one of the specified permissions (OR logic)
 */
export const checkAnyPermission = (
	permissions: Array<{
		resource: PolicyResources;
		action: PolicyActions;
		possession?: PolicyPossession;
	}>
) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			if (!req.user) {
				return res
					.status(401)
					.json(generateErrorMessage('Authentication required'));
			}

			if (!req.user.roles || req.user.roles.length === 0) {
				return res
					.status(403)
					.json(generateErrorMessage('No roles assigned to user'));
			}

			// Check if user has at least one permission
			let hasPermission = false;
			for (const permission of permissions) {
				const result = policyService.checkPermission(
					req.user,
					permission.resource,
					permission.action,
					permission.possession || PolicyPossession.ANY
				);

				if (result.granted) {
					hasPermission = true;
					break;
				}
			}

			if (!hasPermission) {
				logger.warn(
					`No permissions found for user ${req.user.username} for any of the specified resources`
				);
				return res
					.status(403)
					.json(
						generateErrorMessage('Access denied: insufficient permissions')
					);
			}

			next();
		} catch (error) {
			logger.error('Error checking any permission:', error);
			return res
				.status(500)
				.json(
					generateErrorMessage('Internal server error during permission check')
				);
		}
	};
};

// Extend Express Request interface to include permission result
declare global {
	namespace Express {
		interface Request {
			permission?: {
				granted: boolean;
				attributes: string[];
				resource?: string;
				action?: string;
				possession?: string;
			};
		}
	}
}
