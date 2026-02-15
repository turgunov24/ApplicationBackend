import { Request, Response } from 'express';
import db from '../../../../db';
import { referencesDistrictsTable } from '../../../../db/schemas';
import { handleError } from '../../../../utils/handleError';
import { and, asc, eq, ne } from 'drizzle-orm';
import { getAuthUserId } from '../../../../utils/getAuthUserId';
import { generateErrorMessage } from '../../../../utils/generateErrorMessage';
import { SUPER_ADMIN_ID } from '../../../../helpers/config';

/**
 * @swagger
 * /api/references/districts/list:
 *   get:
 *     summary: Get non-deleted districts (id, nameUz, nameRu, regionId)
 *     tags: [References - Districts]
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
	req: Request<{}, {}, {}, { regionId?: string }>,
	res: Response,
) => {
	try {
		const userId = getAuthUserId(req);

		if (!userId)
			return res.status(401).json(generateErrorMessage('Unauthorized'));

		const { regionId } = req.query;

		const whereConditions = [ne(referencesDistrictsTable.status, 'deleted')];

		if (userId !== SUPER_ADMIN_ID) {
			whereConditions.push(eq(referencesDistrictsTable.createdBy, userId));
		}

		if (regionId) {
			whereConditions.push(
				eq(referencesDistrictsTable.regionId, Number(regionId)),
			);
		}

		const districts = await db.query.referencesDistrictsTable.findMany({
			where: and(...whereConditions),
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
