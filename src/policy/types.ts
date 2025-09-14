import { InferSelectModel } from 'drizzle-orm';
import { referencesRolesTable } from '../db/schemas/references/roles';
import { referencesPermissionsTable } from '../db/schemas/references/permissions';
import { referencesPermissionGroupsTable } from '../db/schemas/references/permissionGroups';

// Database model types
export type Role = InferSelectModel<typeof referencesRolesTable>;
export type Permission = InferSelectModel<
	typeof referencesPermissionGroupsTable
>;
export type PermissionGroup = InferSelectModel<
	typeof referencesPermissionGroupsTable
>;

// AccessControl grant structure
export interface AccessControlGrant {
	role: string;
	resource: string;
	action: string;
	attributes: string[];
}

// Resource definitions
export enum PolicyResources {
	USERS = 'users',
	COUNTRIES = 'countries',
	REGIONS = 'regions',
	DISTRICTS = 'districts',
	ROLES = 'roles',
	PERMISSIONS = 'permissions',
	PERMISSION_GROUPS = 'permission-groups',
	ROLES_PERMISSIONS = 'roles-permissions',
}

// Action definitions
export enum PolicyActions {
	CREATE = 'create',
	READ = 'read',
	UPDATE = 'update',
	DELETE = 'delete',
}

// Possession types
export enum PolicyPossession {
	OWN = 'own',
	ANY = 'any',
}

// Permission check result
export interface PermissionCheckResult {
	granted: boolean;
	attributes: string[];
	resource?: string;
	action?: string;
	possession?: string;
}

// User with roles for policy checking
export interface UserWithRoles {
	id: number;
	username: string;
	email: string;
	status: string;
	roles: Role[];
}

// Policy configuration
export interface PolicyConfig {
	refreshInterval: number; // in milliseconds
	enableCaching: boolean;
	enableRoleInheritance: boolean;
}
