import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { CreatePayload } from '../validators';
import { referencesPermissionGroupsTable } from '../../../../db/schemas/references/permissionGroups';
import db from '../../../../db';
import { handleError } from '../../../../utils/handleError';

/**
 * @swagger
 * /api/references/permission-groups/update:
 *   put:
 *     summary: Update an existing permission group's nameUz and nameRu
 *     tags: [References - Permission Groups]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the permission group to update
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
 *                 description: Permission group name in Uzbek
 *               nameRu:
 *                 type: string
 *                 description: Permission group name in Russian
 *     responses:
 *       200:
 *         description: Permission group updated successfully
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
			.update(referencesPermissionGroupsTable)
			.set({
				nameUz,
				nameRu,
				updatedAt: new Date(),
			})
			.where(eq(referencesPermissionGroupsTable.id, Number(id)))
			.returning();

		res.json({ message: 'Permission group updated successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
