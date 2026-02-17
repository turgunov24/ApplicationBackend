import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { CreatePayload } from '../validators';
import { referencesRolesTable } from '../../../../../db/schemas/references/roles';
import db from '../../../../../db';
import { handleError } from '../../../../../utils/handleError';

/**
 * @swagger
 * /api/references/roles/update:
 *   put:
 *     summary: Update an existing role
 *     tags: [References - Roles]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the role to update
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
 *       200:
 *         description: Role updated successfully
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
		const { nameUz, nameRu, descriptionUz, descriptionRu } = req.body;

		await db
			.update(referencesRolesTable)
			.set({
				nameUz,
				nameRu,
				descriptionUz,
				descriptionRu,
				updatedAt: new Date(),
			})
			.where(eq(referencesRolesTable.id, Number(id)))
			.returning();

		res.json({ message: 'Role updated successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
