import { Request, Response } from 'express';
import { CreatePayload } from '../validators';
import { referencesRegionsTable } from '../../../../../db/schemas/references/regions';
import db from '../../../../../db';
import { handleError } from '../../../../../utils/handleError';
import { getAuthUserId } from '../../../../../utils/getAuthUserId';
import { generateErrorMessage } from '../../../../../utils/generateErrorMessage';

/**
 * @swagger
 * /api/references/regions/create:
 *   post:
 *     summary: Create a new region
 *     tags: [References - Regions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nameUz
 *               - nameRu
 *               - countryId
 *             properties:
 *               nameUz:
 *                 type: string
 *                 description: Region name in Uzbek
 *               nameRu:
 *                 type: string
 *                 description: Region name in Russian
 *               countryId:
 *                 type: integer
 *                 description: Country ID
 *     responses:
 *       201:
 *         description: Region created successfully
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
 *                 countryId:
 *                   type: integer
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
		const { nameUz, nameRu, countryId } = req.body;

		const userId = getAuthUserId(req);

		if (!userId)
			return res.status(401).json(generateErrorMessage('Unauthorized'));

		const result = await db
			.insert(referencesRegionsTable)
			.values({
				createdBy: userId,
				nameUz,
				nameRu,
				countryId,
			})
			.returning();

		res.status(201).json(result[0]);
	} catch (error) {
		handleError(res, error);
	}
};
