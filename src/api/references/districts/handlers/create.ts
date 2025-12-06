import { Request, Response } from 'express';
import { CreatePayload } from '../validators';
import { referencesDistrictsTable } from '../../../../db/schemas/references/districts';
import db from '../../../../db';
import { handleError } from '../../../../utils/handleError';

/**
 * @swagger
 * /api/references/districts/create:
 *   post:
 *     summary: Create a new district
 *     tags: [References]
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
 *       201:
 *         description: District created successfully
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
 *                 regionId:
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
	res: Response
) => {
	try {
		const { nameUz, nameRu, regionId } = req.body;

		const result = await db
			.insert(referencesDistrictsTable)
			.values({
				nameUz,
				nameRu,
				regionId,
			})
			.returning();

		res.status(201).json(result[0]);
	} catch (error) {
		handleError(res, error);
	}
};
