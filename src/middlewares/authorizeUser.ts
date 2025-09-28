import { NextFunction, Request, Response } from 'express';
import { handleError } from '../utils/handleError';
import db from '../db';
import {
	referencesPermissionsTable,
	referencesRolesPermissionsTable,
	referencesRolesTable,
	usersRolesTable,
} from '../db/schemas';
import { and, eq } from 'drizzle-orm';
import resources from '../policy/resources';
import { generateErrorMessage } from '../utils/generateErrorMessage';

export const authorizeUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { user, baseUrl } = req;

		const resource = resources.find((r) => r.endpoint === baseUrl);

		if (!resource) {
			return res.status(400).json(generateErrorMessage('Resource not found'));
		}

		const roles = await db
			.select()
			.from(usersRolesTable)
			.innerJoin(
				referencesRolesTable,
				eq(usersRolesTable.roleId, referencesRolesTable.id)
			)
			.where(
				and(
					eq(usersRolesTable.userId, user.id),
					eq(referencesRolesTable.status, 'active')
				)
			);

		for (const role of roles) {
			const permissions = await db
				.select({
					permission: referencesPermissionsTable,
					rolePermission: referencesRolesPermissionsTable,
				})
				.from(referencesRolesPermissionsTable)
				.innerJoin(
					referencesPermissionsTable,
					eq(
						referencesRolesPermissionsTable.permissionId,
						referencesPermissionsTable.id
					)
				)
				.where(
					and(
						eq(
							referencesRolesPermissionsTable.roleId,
							role.references_roles.id
						),
						eq(referencesPermissionsTable.status, 'active')
					)
				);

			for (const { permission } of permissions) {
				if (!permission.action) continue;
				if (!permission.resource) continue;

				const granted = resource.allowedActions.some(
					(allowedAction) => permission.action === allowedAction
				);
				if (granted) {
					return next();
				}
			}
		}
		return res.status(403).json(generateErrorMessage('Access denied'));
	} catch (error: unknown) {
		handleError(res, error);
	}
};
