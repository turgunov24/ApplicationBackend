import { Request, Response } from 'express';
import db from '../../../../db';
import { referencesRolesTable } from '../../../../db/schemas/references/roles';
import { handleError } from '../../../../utils/handleError';
import { asc, ne } from 'drizzle-orm';

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
		const roles = await db.query.referencesRolesTable.findMany({
			where: ne(referencesRolesTable.status, 'deleted'),
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
