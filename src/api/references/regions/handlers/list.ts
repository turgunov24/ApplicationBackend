import { Request, Response } from 'express'
import db from '../../../../db'
import { referencesRegionsTable } from '../../../../db/schemas'
import { handleError } from '../../../../utils/handleError'
import { and, asc, eq, ne } from 'drizzle-orm'
import { ListValidationSchema } from '../validators'

/**
 * @swagger
 * /api/references/regions/list:
 *   get:
 *     summary: Get non-deleted regions (id, nameUz, nameRu, countryId)
 *     tags: [References]
 *     parameters:
 *       - in: query
 *         name: countryId
 *         schema:
 *           type: string
 *         description: Filter regions by country ID
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
 *                   countryId:
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
		const { countryId } = req.query;

		if (countryId) {
			const regions = await db.query.referencesRegionsTable.findMany({
				where: and(
					ne(referencesRegionsTable.status, 'deleted'),
					eq(referencesRegionsTable.countryId, Number(countryId))
				),
				orderBy: asc(referencesRegionsTable.createdAt),
				columns: {
					id: true,
					nameUz: true,
					nameRu: true,
					countryId: true,
				},
			});
			res.json(regions);
			return;
		}

		const regions = await db.query.referencesRegionsTable.findMany({
			where: ne(referencesRegionsTable.status, 'deleted'),
			orderBy: asc(referencesRegionsTable.createdAt),
			columns: {
				id: true,
				nameUz: true,
				nameRu: true,
				countryId: true,
			},
		});
		res.json(regions);
	} catch (error) {
		handleError(res, error);
	}
};
