import { Request, Response } from 'express';
import { ne } from 'drizzle-orm';
import { referencesRolesTable } from '../../../../db/schemas/references/roles';
import db from '../../../../db';
import { handleError } from '../../../../utils/handleError';

/**
 * @swagger
 * /api/references/roles-permissions:
 *   get:
 *     summary: Get all role permissions mapping
 *     tags: [References - Roles Permissions]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Role ID
 *                   permissions:
 *                     type: array
 *                     items:
 *                       type: integer
 *                     description: Array of permission IDs assigned to this role
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

export const getRolePermissionsHandler = async (
	req: Request,
	res: Response
) => {
	try {
		const roles = await db.query.referencesRolesTable.findMany({
			where: ne(referencesRolesTable.status, 'deleted'),
			columns: {
				id: true,
			},
			with: {
				rolesPermissions: {
					columns: {
						permissionId: true,
					},
				},
			},
		});

		res.json(
			roles.map((role) => ({
				id: role.id,
				permissions: role.rolesPermissions.map((rp) => rp.permissionId),
			}))
		);
	} catch (error: unknown) {
		handleError(res, error);
	}
};
