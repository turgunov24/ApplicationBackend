import { Request, Response } from 'express';
import { and, eq, ne } from 'drizzle-orm';
import { referencesRolesTable } from '../../../../db/schemas/references/roles';
import db from '../../../../db';
import { handleError } from '../../../../utils/handleError';
import { getAuthUserId } from '../../../../utils/getAuthUserId';
import { generateErrorMessage } from '../../../../utils/generateErrorMessage';
import { SUPER_ADMIN_ID } from '../../../../helpers/config'

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
	res: Response,
) => {
	try {
		const userId = getAuthUserId(req);

		if (!userId) {
			return res.status(401).json(generateErrorMessage('Unauthorized'));
		}

		const whereConditions = [ne(referencesRolesTable.status, 'deleted')];

		if (userId !== SUPER_ADMIN_ID) {
			whereConditions.push(eq(referencesRolesTable.createdBy, userId));
		}

		const roles = await db.query.referencesRolesTable.findMany({
			where: and(...whereConditions),
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
			})),
		);
	} catch (error: unknown) {
		handleError(res, error);
	}
};
