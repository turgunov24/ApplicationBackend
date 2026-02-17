import { Request, Response } from 'express';
import { CreatePayload } from '../validators';
import { referencesCurrenciesTable } from '../../../../../db/schemas/references/currencies';
import db from '../../../../../db';
import { handleError } from '../../../../../utils/handleError';
import { getAuthUserId } from '../../../../../utils/getAuthUserId';
import { generateErrorMessage } from '../../../../../utils/generateErrorMessage';

/**
 * @swagger
 * /api/references/currencies/create:
 *   post:
 *     summary: Create a new currency
 *     tags: [References - Currencies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nameUz
 *               - nameRu
 *             properties:
 *               nameUz:
 *                 type: string
 *                 description: Currency name in Uzbek
 *               nameRu:
 *                 type: string
 *                 description: Currency name in Russian
 *     responses:
 *       201:
 *         description: Currency created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nameUz:
 *                   type: string
 *                 nameRu:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 status:
 *                   type: string
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

export const createHandler = async (
	req: Request<{}, {}, CreatePayload>,
	res: Response,
) => {
	try {
		const { nameUz, nameRu } = req.body;

		const userId = getAuthUserId(req);

		if (!userId)
			return res.status(401).json(generateErrorMessage('Unauthorized'));

		const result = await db
			.insert(referencesCurrenciesTable)
			.values({
				createdBy: userId,
				nameUz,
				nameRu,
			})
			.returning();

		res.status(201).json(result[0]);
	} catch (error) {
		handleError(res, error);
	}
};
