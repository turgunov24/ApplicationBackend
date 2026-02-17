import { Request, Response } from 'express';
import db from '../../../../../db';
import { referencesRolesTable } from '../../../../../db/schemas/references/roles';
import { handleError } from '../../../../../utils/handleError';
import { and, asc, eq, ne } from 'drizzle-orm';
import { getAuthUserId } from '../../../../../utils/getAuthUserId';
import { generateErrorMessage } from '../../../../../utils/generateErrorMessage';
import { SUPER_ADMIN_ID } from '../../../../../helpers/config';

/**
 * @swagger
 * /api/references/roles/list:
 *   get:
 *     summary: Get non-deleted roles (id, nameUz, nameRu, descriptionUz, descriptionRu)
 *     tags: [References - Roles]
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
 *                   descriptionUz:
 *                     type: string
 *                   descriptionRu:
 *                     type: string
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

		const whereConditions = [ne(referencesRolesTable.status, 'deleted')];

		if (userId !== SUPER_ADMIN_ID) {
			whereConditions.push(eq(referencesRolesTable.createdBy, userId));
		}

		const roles = await db.query.referencesRolesTable.findMany({
			where: and(...whereConditions),
			orderBy: asc(referencesRolesTable.createdAt),
			columns: {
				id: true,
				nameUz: true,
				nameRu: true,
				descriptionUz: true,
				descriptionRu: true,
			},
		});
		res.json(roles);
	} catch (error) {
		handleError(res, error);
	}
};
