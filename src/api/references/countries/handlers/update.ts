import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { CreatePayload } from '../validators';
import { referencesCountriesTable } from '../../../../db/schemas/references/countries';
import db from '../../../../db';
import { handleError } from '../../../../utils/handleError';

/**
 * @swagger
 * /api/references/countries/update:
 *   put:
 *     summary: Update an existing country's nameUz and nameRu
 *     tags: [References]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the country to update
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
 *       200:
 *         description: Country updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
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


export const updateHandler = async (
	req: Request<{}, {}, CreatePayload, { id: string }>,
	res: Response
) => {
	try {
		const { id } = req.query;
		const { nameUz, nameRu } = req.body;

		await db
			.update(referencesCountriesTable)
			.set({
				nameUz,
				nameRu,
				updatedAt: new Date(),
			})
			.where(eq(referencesCountriesTable.id, Number(id)))
			.returning();

		res.json({ message: 'Country updated successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
