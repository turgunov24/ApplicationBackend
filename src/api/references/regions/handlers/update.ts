import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { CreatePayload } from '../validators';
import { referencesRegionsTable } from '../../../../db/schemas/references/regions';
import db from '../../../../db';
import { handleError } from '../../../../utils/handleError';

/**
 * @swagger
 * /api/references/regions/update:
 *   put:
 *     summary: Update an existing region's nameUz, nameRu and countryId
 *     tags: [References]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the region to update
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
 *       200:
 *         description: Region updated successfully
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
		const { nameUz, nameRu ,countryId} = req.body;

		await db
			.update(referencesRegionsTable)
			.set({
				nameUz,
				nameRu,
				countryId,
				updatedAt: new Date(),
			})
			.where(eq(referencesRegionsTable.id, Number(id)))
			.returning();

		res.json({ message: 'Region updated successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
