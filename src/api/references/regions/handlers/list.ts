import { Request, Response } from 'express';
import db from '../../../../db';
import { referencesRegionsTable } from '../../../../db/schemas';
import { handleError } from '../../../../utils/handleError';
import { and, asc, eq, ne } from 'drizzle-orm';
import { getAuthUserId } from '../../../../utils/getAuthUserId';
import { generateErrorMessage } from '../../../../utils/generateErrorMessage'
import { SUPER_ADMIN_ID } from '../../../../helpers/config'

/**
 * @swagger
 * /api/references/regions/list:
 *   get:
 *     summary: Get non-deleted regions (id, nameUz, nameRu, countryId)
 *     tags: [References - Regions]
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
	req: Request<{}, {}, {}, { countryId?: string }>,
	res: Response,
) => {
	try {
		const userId = getAuthUserId(req);

		if (!userId)
			return res.status(401).json(generateErrorMessage('Unauthorized'));
		
		const { countryId } = req.query;

		const whereConditions = [ne(referencesRegionsTable.status, 'deleted')];

		if (userId !== SUPER_ADMIN_ID) {
			whereConditions.push(eq(referencesRegionsTable.createdBy, userId));
		}

		if (countryId) {
			whereConditions.push(
				eq(referencesRegionsTable.countryId, Number(countryId)),
			);
		}

		const regions = await db.query.referencesRegionsTable.findMany({
			where: and(...whereConditions),
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
