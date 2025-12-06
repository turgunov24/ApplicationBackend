import { Request, Response } from 'express'
import db from '../../../../db'
import { referencesCountriesTable } from '../../../../db/schemas'
import { handleError } from '../../../../utils/handleError'
import { asc, ne } from 'drizzle-orm'

/**
 * @swagger
 * /api/references/countries/list:
 *   get:
 *     summary: Get non-deleted countries (id, nameUz, nameRu)
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
		const countries = await db.query.referencesCountriesTable.findMany({
			where: ne(referencesCountriesTable.status, 'deleted'),
			orderBy: asc(referencesCountriesTable.createdAt),
			columns: {
				id: true,
				nameUz: true,
				nameRu: true,
			},
		});
		res.json(countries);
	} catch (error) {
		handleError(res, error);
	}
};
