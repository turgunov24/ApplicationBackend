import { Request, Response } from 'express';
import db from '../../../../db';
import { referencesCountriesTable } from '../../../../db/schemas';
import { handleError } from '../../../../utils/handleError';
import { asc, and, eq, ne } from 'drizzle-orm';
import { getAuthUserId } from '../../../../utils/getAuthUserId';
import { generateErrorMessage } from '../../../../utils/generateErrorMessage';
import { SUPER_ADMIN_ID } from '../../../../helpers/config';

/**
 * @swagger
 * /api/references/countries/list:
 *   get:
 *     summary: Get non-deleted countries (id, nameUz, nameRu)
 *     tags: [References - Countries]
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
		const userId = getAuthUserId(req);

		if (!userId)
			return res.status(401).json(generateErrorMessage('Unauthorized'));

		const whereConditions = [ne(referencesCountriesTable.status, 'deleted')];

		if (userId !== SUPER_ADMIN_ID) {
			whereConditions.push(eq(referencesCountriesTable.createdBy, userId));
		}

		const countries = await db.query.referencesCountriesTable.findMany({
			where: and(...whereConditions),
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
