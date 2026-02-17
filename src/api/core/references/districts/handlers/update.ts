import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { CreatePayload } from '../validators';
import { referencesDistrictsTable } from '../../../../../db/schemas/references/districts';
import db from '../../../../../db';
import { handleError } from '../../../../../utils/handleError';

/**
 * @swagger
 * /api/references/districts/update:
 *   put:
 *     summary: Update an existing district's nameUz, nameRu and regionId
 *     tags: [References - Districts]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the district to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nameUz
 *               - nameRu
 *               - regionId
 *             properties:
 *               nameUz:
 *                 type: string
 *                 description: District name in Uzbek
 *               nameRu:
 *                 type: string
 *                 description: District name in Russian
 *               regionId:
 *                 type: integer
 *                 description: Region ID
 *     responses:
 *       200:
 *         description: District updated successfully
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
		const { nameUz, nameRu, regionId } = req.body;

		await db
			.update(referencesDistrictsTable)
			.set({
				nameUz,
				nameRu,
				regionId,
				updatedAt: new Date(),
			})
			.where(eq(referencesDistrictsTable.id, Number(id)))
			.returning();

		res.json({ message: 'District updated successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
