import { Request, Response } from 'express';
import db from '../../../../db';
import {
	referencesPermissionGroupsTable,
	referencesPermissionsTable,
} from '../../../../db/schemas';
import { handleError } from '../../../../utils/handleError';
import { and, asc, eq, ne } from 'drizzle-orm';
import { getAuthUserId } from '../../../../utils/getAuthUserId';
import { generateErrorMessage } from '../../../../utils/generateErrorMessage';
import { SUPER_ADMIN_ID } from '../../../../helpers/config';

/**
 * @swagger
 * /api/references/permission-groups/list:
 *   get:
 *     summary: Get non-deleted permission groups with their permissions
 *     tags: [References - Permission Groups]
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
		const userId = getAuthUserId(req);

		if (!userId)
			return res.status(401).json(generateErrorMessage('Unauthorized'));

		const whereConditions = [
			ne(referencesPermissionGroupsTable.status, 'deleted'),
		];

		if (userId !== SUPER_ADMIN_ID) {
			whereConditions.push(
				eq(referencesPermissionGroupsTable.createdBy, userId),
			);
		}

		const permissionGroups =
			await db.query.referencesPermissionGroupsTable.findMany({
				where: and(...whereConditions),
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
