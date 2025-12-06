import { Request, Response } from 'express';
import db from '../../../../db';
import { referencesPermissionsTable } from '../../../../db/schemas';
import { handleError } from '../../../../utils/handleError';
import { and, asc, eq, ne } from 'drizzle-orm';
import { ListValidationSchema } from '../validators';

/**
 * @swagger
 * /api/references/permissions/list:
 *   get:
 *     summary: Get non-deleted permissions (id, nameUz, nameRu, permissionGroupId)
 *     tags: [References - Permissions]
 *     parameters:
 *       - in: query
 *         name: permissionGroupId
 *         schema:
 *           type: string
 *         description: Filter permissions by permission group ID
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
 *                   nameUz:
 *                     type: string
 *                   nameRu:
 *                     type: string
 *                   permissionGroupId:
 *                     type: integer
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

export const listHandler = async (
	req: Request<{}, {}, {}, ListValidationSchema>,
	res: Response
) => {
	try {
		const { permissionGroupId } = req.query;

		if (permissionGroupId) {
			const permissions = await db.query.referencesPermissionsTable.findMany({
				where: and(
					ne(referencesPermissionsTable.status, 'deleted'),
					eq(referencesPermissionsTable.permissionGroupId, Number(permissionGroupId))
				),
				orderBy: asc(referencesPermissionsTable.createdAt),
				columns: {
					id: true,
					nameUz: true,
					nameRu: true,
					permissionGroupId: true,
				},
			});
			res.json(permissions);
			return;
		}

		const permissions = await db.query.referencesPermissionsTable.findMany({
			where: ne(referencesPermissionsTable.status, 'deleted'),
			orderBy: asc(referencesPermissionsTable.createdAt),
			columns: {
				id: true,
				nameUz: true,
				nameRu: true,
				permissionGroupId: true,
			},
		});
		res.json(permissions);
	} catch (error) {
		handleError(res, error);
	}
};
