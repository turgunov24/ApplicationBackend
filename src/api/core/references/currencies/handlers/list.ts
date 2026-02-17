import { Request, Response } from 'express';
import db from '../../../../../db';
import { referencesCurrenciesTable } from '../../../../../db/schemas';
import { handleError } from '../../../../../utils/handleError';
import { and, asc, eq, ne } from 'drizzle-orm';
import { getAuthUserId } from '../../../../../utils/getAuthUserId';
import { generateErrorMessage } from '../../../../../utils/generateErrorMessage';
import { SUPER_ADMIN_ID } from '../../../../../helpers/config';

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
		const userId = getAuthUserId(req);

		if (!userId)
			return res.status(401).json(generateErrorMessage('Unauthorized'));

		const whereConditions = [ne(referencesCurrenciesTable.status, 'deleted')];

		if (userId !== SUPER_ADMIN_ID) {
			whereConditions.push(eq(referencesCurrenciesTable.createdBy, userId));
		}

		const currencies = await db.query.referencesCurrenciesTable.findMany({
			where: and(...whereConditions),
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
