import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { referencesRolesPermissionsTable } from '../../../../db/schemas/references/rolesPermissions';
import { referencesRolesTable } from '../../../../db/schemas/references/roles';
import db from '../../../../db';
import { handleError } from '../../../../utils/handleError';

export const getRolePermissionsHandler = async (
	req: Request,
	res: Response
) => {
	try {
		// Get all role permissions
		const rolePermissions = await db
			.select({
				roleId: referencesRolesPermissionsTable.roleId,
				permissionId: referencesRolesPermissionsTable.permissionId,
			})
			.from(referencesRolesPermissionsTable);

		// Get all roles to ensure we return all roles even if they have no permissions
		const allRoles = await db
			.select({
				id: referencesRolesTable.id,
			})
			.from(referencesRolesTable)
			.where(eq(referencesRolesTable.status, 'active'));

		// Group permissions by role
		const rolePermissionsMap = new Map<number, number[]>();

		// Initialize all roles with empty permission arrays
		allRoles.forEach((role) => {
			rolePermissionsMap.set(role.id, []);
		});

		// Populate permissions for each role
		rolePermissions.forEach((rp) => {
			const existingPermissions = rolePermissionsMap.get(rp.roleId) || [];
			existingPermissions.push(rp.permissionId);
			rolePermissionsMap.set(rp.roleId, existingPermissions);
		});

		// Convert to the required format
		const result: { [key: number]: number[] } = {};

		// Populate the result object
		rolePermissionsMap.forEach((permissionIds, roleId) => {
			result[roleId] = permissionIds;
		});

		res.json({
			result,
		});
	} catch (error: unknown) {
		handleError(res, error);
	}
};
