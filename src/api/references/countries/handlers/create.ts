import { Request, Response } from 'express';
import { CreatePayload } from '../validators';
import { referencesCountriesTable } from '../../../../db/schemas/references/countries';
import db from '../../../../db';
import { handleError } from '../../../../utils/handleError';

/**
 * @swagger
 * /api/references/countries/create:
 *   post:
 *     summary: Create a new country
 *     tags: [References - Countries]
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
 *                 description: Country name in Uzbek
 *               nameRu:
 *                 type: string
 *                 description: Country name in Russian
 *     responses:
 *       201:
 *         description: Country created successfully
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
	res: Response
) => {
	try {
		const { nameUz, nameRu } = req.body;

		const result = await db
			.insert(referencesCountriesTable)
			.values({
				nameUz,
				nameRu,
			})
			.returning();

		res.status(201).json(result[0]);
	} catch (error) {
		handleError(res, error);
	}
};
