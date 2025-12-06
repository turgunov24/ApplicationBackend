import { Request, Response } from 'express';
import db from '../../../../db';
import {
	referencesPermissionGroupsTable,
	referencesPermissionsTable,
} from '../../../../db/schemas';
import { handleError } from '../../../../utils/handleError';
import { asc, ne } from 'drizzle-orm';

/**
 * @swagger
 * /api/references/permission-groups/list:
 *   get:
 *     summary: Get non-deleted permission groups with their permissions
 *     tags: [References]
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
 *                   permissions:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         nameUz:
 *                           type: string
 *                         nameRu:
 *                           type: string
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

export const listHandler = async (req: Request, res: Response) => {
	try {
		const permissionGroups = await db.query.referencesPermissionGroupsTable.findMany({
			where: ne(referencesPermissionGroupsTable.status, 'deleted'),
			orderBy: asc(referencesPermissionGroupsTable.createdAt),
			columns: {
				id: true,
				nameUz: true,
				nameRu: true,
			},
			with: {
				permissions: {
					where: ne(referencesPermissionsTable.status, 'deleted'),
					columns: {
						id: true,
						nameUz: true,
						nameRu: true,
					},
				},
			},
		});

		res.json(permissionGroups);
	} catch (error) {
		handleError(res, error);
	}
};
