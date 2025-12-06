import { Request, Response } from 'express'
import db from '../../../../db'
import { referencesDistrictsTable } from '../../../../db/schemas'
import { handleError } from '../../../../utils/handleError'
import { and, asc, eq, ne } from 'drizzle-orm'
import { ListValidationSchema } from '../validators'

/**
 * @swagger
 * /api/references/districts/list:
 *   get:
 *     summary: Get non-deleted districts (id, nameUz, nameRu, regionId)
 *     tags: [References]
 *     parameters:
 *       - in: query
 *         name: regionId
 *         schema:
 *           type: string
 *         description: Filter districts by region ID
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
 *                   regionId:
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
		const { regionId } = req.query;

		if (regionId) {
			const districts = await db.query.referencesDistrictsTable.findMany({
				where: and(
					ne(referencesDistrictsTable.status, 'deleted'),
					eq(referencesDistrictsTable.regionId, Number(regionId))
				),
				orderBy: asc(referencesDistrictsTable.createdAt),
				columns: {
					id: true,
					nameUz: true,
					nameRu: true,
					regionId: true,
				},
			});
			res.json(districts);
			return;
		}

		const districts = await db.query.referencesDistrictsTable.findMany({
			where: ne(referencesDistrictsTable.status, 'deleted'),
			orderBy: asc(referencesDistrictsTable.createdAt),
			columns: {
				id: true,
				nameUz: true,
				nameRu: true,
				regionId: true,
			},
		});
		res.json(districts);
	} catch (error) {
		handleError(res, error);
	}
};
