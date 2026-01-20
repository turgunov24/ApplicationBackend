import { Request, Response } from 'express';
import db from '../../../../db';
import { referencesCurrenciesTable } from '../../../../db/schemas';
import { handleError } from '../../../../utils/handleError';
import { asc, ne } from 'drizzle-orm';

/**
 * @swagger
 * /api/references/currencies/list:
 *   get:
 *     summary: Get non-deleted currencies (id, nameUz, nameRu)
 *     tags: [References - Currencies]
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
		const currencies = await db.query.referencesCurrenciesTable.findMany({
			where: ne(referencesCurrenciesTable.status, 'deleted'),
			orderBy: asc(referencesCurrenciesTable.createdAt),
			columns: {
				id: true,
				nameUz: true,
				nameRu: true,
			},
		});
		res.json(currencies);
	} catch (error) {
		handleError(res, error);
	}
};
