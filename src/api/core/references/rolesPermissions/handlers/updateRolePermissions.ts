import { Request, Response } from 'express';
import { inArray } from 'drizzle-orm';
import { referencesRolesPermissionsTable } from '../../../../../db/schemas/references/rolesPermissions';
import db from '../../../../../db';
import { handleError } from '../../../../../utils/handleError';
import { UpdateRolePermissionsPayload } from '../validators';
import { usersRolesTable } from '../../../../../db/schemas';
import { notifyUsersPermissionUpdate } from '../../../../../websocket';

/**
 * @swagger
 * /api/references/roles-permissions:
 *   put:
 *     summary: Update role permissions mapping for multiple roles
 *     tags: [References - Roles Permissions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               values:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     roleId:
 *                       type: integer
 *                       description: Role ID to update
 *                     permissionIds:
 *                       type: array
 *                       items:
 *                         type: integer
 *                       description: Array of new permission IDs for this role
 *     responses:
 *       200:
 *         description: Updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 */

export const updateRolePermissionsHandler = async (
	req: Request<{}, {}, UpdateRolePermissionsPayload>,
	res: Response,
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

		// Find all users who have these roles and notify them
		const usersWithRoles = await db
			.select({ userId: usersRolesTable.userId })
			.from(usersRolesTable)
			.where(inArray(usersRolesTable.roleId, roleIds));

		const affectedUserIds = [...new Set(usersWithRoles.map((u) => u.userId))];
		notifyUsersPermissionUpdate(affectedUserIds);

		res.json({
			message: 'Role permissions updated successfully',
		});
	} catch (error: unknown) {
		handleError(res, error);
	}
};
