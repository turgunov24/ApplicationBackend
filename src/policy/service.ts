import { AccessControl, IQueryInfo } from 'accesscontrol';
import db from '../db';
import { referencesRolesTable } from '../db/schemas/references/roles';
import { referencesPermissionsTable } from '../db/schemas/references/permissions';
import { referencesRolesPermissionsTable } from '../db/schemas/references/rolesPermissions';
import { referencesPermissionGroupsTable } from '../db/schemas/references/permissionGroups';
import { eq, and, ne } from 'drizzle-orm';
import { logger } from '../utils/logger';
import {
	PolicyResources,
	PolicyActions,
	PolicyPossession,
	AccessControlGrant,
	UserWithRoles,
	PolicyConfig,
	PermissionCheckResult,
} from './types';

export class PolicyService {
	private accessControl: AccessControl;
	private config: PolicyConfig;
	private refreshTimer: NodeJS.Timeout | null = null;
	private isInitialized = false;

	constructor(
		config: PolicyConfig = {
			refreshInterval: 5 * 60 * 1000, // 5 minutes
			enableCaching: true,
			enableRoleInheritance: true,
		}
	) {
		this.config = config;
		this.accessControl = new AccessControl();
		this.initialize();
	}

	/**
	 * Initialize the policy service and start periodic refresh
	 */
	private async initialize(): Promise<void> {
		try {
			await this.loadGrantsFromDatabase();
			this.startPeriodicRefresh();
			this.isInitialized = true;
			logger.info('Policy service initialized successfully');
		} catch (error) {
			logger.error('Failed to initialize policy service:', error);
			throw error;
		}
	}

	/**
	 * Load grants from database and update AccessControl
	 */
	private async loadGrantsFromDatabase(): Promise<void> {
		try {
			// Get all active roles
			const roles = await db
				.select()
				.from(referencesRolesTable)
				.where(eq(referencesRolesTable.status, 'active'));

			// Get all active permissions
			const permissions = await db
				.select({
					id: referencesPermissionsTable.id,
					nameUz: referencesPermissionsTable.nameUz,
					nameRu: referencesPermissionsTable.nameRu,
					permissionGroupId: referencesPermissionsTable.permissionGroupId,
				})
				.from(referencesPermissionsTable)
				.where(eq(referencesPermissionsTable.status, 'active'));

			// Get role-permission mappings
			const rolePermissions = await db
				.select({
					roleId: referencesRolesPermissionsTable.roleId,
					permissionId: referencesRolesPermissionsTable.permissionId,
				})
				.from(referencesRolesPermissionsTable);

			// Get permission groups for resource mapping
			const permissionGroups = await db
				.select()
				.from(referencesPermissionGroupsTable)
				.where(eq(referencesPermissionGroupsTable.status, 'active'));

			// Transform to AccessControl grants
			const grants = this.transformToAccessControlGrants(
				roles,
				permissions,
				rolePermissions,
				permissionGroups
			);

			// Update AccessControl with new grants
			this.accessControl.setGrants(grants);

			logger.info(`Loaded ${grants.length} policy grants from database`);
		} catch (error) {
			logger.error('Failed to load grants from database:', error);
			throw error;
		}
	}

	/**
	 * Transform database data to AccessControl grants format
	 */
	private transformToAccessControlGrants(
		roles: any[],
		permissions: any[],
		rolePermissions: any[],
		permissionGroups: any[]
	): AccessControlGrant[] {
		const grants: AccessControlGrant[] = [];

		// Create a map of permission groups to resources
		const groupToResourceMap = new Map<number, string>();
		permissionGroups.forEach((group) => {
			// Map permission group names to resources
			const resourceName = this.mapPermissionGroupToResource(group.nameUz);
			groupToResourceMap.set(group.id, resourceName);
		});

		// Create a map of permissions to their groups
		const permissionToGroupMap = new Map<number, number>();
		permissions.forEach((permission) => {
			permissionToGroupMap.set(permission.id, permission.permissionGroupId);
		});

		// Process each role
		roles.forEach((role) => {
			const roleName = role.nameUz.toLowerCase().replace(/\s+/g, '-');

			// Get permissions for this role
			const rolePermissionMappings = rolePermissions.filter(
				(rp) => rp.roleId === role.id
			);

			// Group permissions by resource
			const resourcePermissions = new Map<string, string[]>();

			rolePermissionMappings.forEach((rp) => {
				const permission = permissions.find((p) => p.id === rp.permissionId);
				if (permission) {
					const groupId = permissionToGroupMap.get(permission.id);
					if (groupId) {
						const resource = groupToResourceMap.get(groupId);
						if (resource) {
							const action = this.mapPermissionToAction(permission.nameUz);
							if (!resourcePermissions.has(resource)) {
								resourcePermissions.set(resource, []);
							}
							resourcePermissions.get(resource)!.push(action);
						}
					}
				}
			});

			// Create grants for each resource-action combination
			resourcePermissions.forEach((actions, resource) => {
				actions.forEach((action) => {
					// Determine possession based on role hierarchy
					const possession = this.determinePossession(roleName, action);

					grants.push({
						role: roleName,
						resource,
						action: `${action}:${possession}`,
						attributes: ['*'], // All attributes for now
					});
				});
			});
		});

		return grants;
	}

	/**
	 * Map permission group names to resource names
	 */
	private mapPermissionGroupToResource(groupName: string): string {
		const name = groupName.toLowerCase();

		if (name.includes('user')) return PolicyResources.USERS;
		if (name.includes('country')) return PolicyResources.COUNTRIES;
		if (name.includes('region')) return PolicyResources.REGIONS;
		if (name.includes('district')) return PolicyResources.DISTRICTS;
		if (name.includes('role')) return PolicyResources.ROLES;
		if (name.includes('permission')) return PolicyResources.PERMISSIONS;
		if (name.includes('group')) return PolicyResources.PERMISSION_GROUPS;

		// Default fallback
		return groupName.toLowerCase().replace(/\s+/g, '-');
	}

	/**
	 * Map permission names to actions
	 */
	private mapPermissionToAction(permissionName: string): string {
		const name = permissionName.toLowerCase();

		if (name.includes('create') || name.includes('add'))
			return PolicyActions.CREATE;
		if (name.includes('read') || name.includes('view') || name.includes('list'))
			return PolicyActions.READ;
		if (
			name.includes('update') ||
			name.includes('edit') ||
			name.includes('modify')
		)
			return PolicyActions.UPDATE;
		if (name.includes('delete') || name.includes('remove'))
			return PolicyActions.DELETE;

		// Default to read if unclear
		return PolicyActions.READ;
	}

	/**
	 * Determine possession (own/any) based on role and action
	 */
	private determinePossession(roleName: string, action: string): string {
		// Admin roles can access any resource
		if (roleName.includes('admin') || roleName.includes('super')) {
			return PolicyPossession.ANY;
		}

		// For create and read actions, allow any
		if (action === PolicyActions.CREATE || action === PolicyActions.READ) {
			return PolicyPossession.ANY;
		}

		// For update and delete, restrict to own resources for non-admin roles
		return PolicyPossession.OWN;
	}

	/**
	 * Start periodic refresh of grants
	 */
	private startPeriodicRefresh(): void {
		if (this.refreshTimer) {
			clearInterval(this.refreshTimer);
		}

		this.refreshTimer = setInterval(async () => {
			try {
				await this.loadGrantsFromDatabase();
				logger.info('Policy grants refreshed from database');
			} catch (error) {
				logger.error('Failed to refresh policy grants:', error);
			}
		}, this.config.refreshInterval);
	}

	/**
	 * Check if user has permission for a specific resource and action
	 */
	public checkPermission(
		user: UserWithRoles,
		resource: string,
		action: string,
		possession: string = PolicyPossession.ANY
	): PermissionCheckResult {
		if (!this.isInitialized) {
			logger.warn('Policy service not initialized, denying access');
			return { granted: false, attributes: [] };
		}
		console.log('user.roles',user.roles);
		try {
			// Check each role the user has
			for (const role of user.roles) {
				const roleName = role.nameUz.toLowerCase().replace(/\s+/g, '-');
				const permission = (this.accessControl.can(roleName) as any)[action](
					resource,
					possession
				);

				if (permission.granted) {
					return {
						granted: true,
						attributes: permission.attributes,
						resource,
						action,
						possession,
					};
				}
			}

			return { granted: false, attributes: [] };
		} catch (error) {
			logger.error('Error checking permission:', error);
			return { granted: false, attributes: [] };
		}
	}

	/**
	 * Get all grants (for debugging)
	 */
	public getGrants(): any {
		return this.accessControl.getGrants();
	}

	/**
	 * Manually refresh grants (for testing or immediate updates)
	 */
	public async refreshGrants(): Promise<void> {
		await this.loadGrantsFromDatabase();
	}

	/**
	 * Stop the service and cleanup
	 */
	public destroy(): void {
		if (this.refreshTimer) {
			clearInterval(this.refreshTimer);
			this.refreshTimer = null;
		}
		this.isInitialized = false;
		logger.info('Policy service destroyed');
	}
}

// Singleton instance
export const policyService = new PolicyService();
