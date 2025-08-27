import { Request, Response } from 'express';
import { inArray } from 'drizzle-orm';
import { referencesRolesPermissionsTable } from '../../../../db/schemas/references/rolesPermissions';
import db from '../../../../db';
import { handleError } from '../../../../utils/handleError';
import { UpdateRolePermissionsPayload } from '../validators';

export const updateRolePermissionsHandler = async (
	req: Request<{}, {}, UpdateRolePermissionsPayload>,
	res: Response
) => {
	try {
		const { values } = req.body;

		// Get all role IDs from the request
		const roleIds = values.map((rp) => rp.roleId);

		// Start a transaction
		await db.transaction(async (tx) => {
			// Delete all existing role permissions for the specified roles
			await tx
				.delete(referencesRolesPermissionsTable)
				.where(inArray(referencesRolesPermissionsTable.roleId, roleIds));

			// Insert new role permissions
			const newRolePermissions = values.flatMap((rp) => {
				if (Array.isArray(rp.permissionIds)) {
					return rp.permissionIds.map((permissionId) => ({
						roleId: rp.roleId,
						permissionId,
					}));
				} else {
					throw new Error('PermissionIds must be an array');
				}
			});

			if (newRolePermissions.length > 0) {
				await tx
					.insert(referencesRolesPermissionsTable)
					.values(newRolePermissions);
			}
		});

		res.json({
			message: 'Role permissions updated successfully',
		});
	} catch (error: unknown) {
		handleError(res, error);
	}
};
