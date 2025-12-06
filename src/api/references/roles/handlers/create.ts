import { Request, Response } from 'express';
import { CreatePayload } from '../validators';
import { referencesRolesTable } from '../../../../db/schemas/references/roles';
import db from '../../../../db';
import { handleError } from '../../../../utils/handleError';

/**
 * @swagger
 * /api/references/roles/create:
 *   post:
 *     summary: Create a new role
 *     tags: [References - Roles]
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
 *                 description: Role name in Uzbek
 *               nameRu:
 *                 type: string
 *                 description: Role name in Russian
 *               descriptionUz:
 *                 type: string
 *                 description: Role description in Uzbek
 *               descriptionRu:
 *                 type: string
 *                 description: Role description in Russian
 *     responses:
 *       201:
 *         description: Role created successfully
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
 *                 descriptionUz:
 *                   type: string
 *                 descriptionRu:
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
		const { nameUz, nameRu, descriptionUz, descriptionRu } = req.body;

		const result = await db
			.insert(referencesRolesTable)
			.values({
				nameUz,
				nameRu,
				descriptionUz,
				descriptionRu,
			})
			.returning();

		res.status(201).json(result[0]);
	} catch (error) {
		handleError(res, error);
	}
};
