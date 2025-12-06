import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { CreatePayload } from '../validators';
import { referencesPermissionsTable } from '../../../../db/schemas/references/permissions';
import db from '../../../../db';
import { handleError } from '../../../../utils/handleError';

/**
 * @swagger
 * /api/references/permissions/update:
 *   put:
 *     summary: Update an existing permission
 *     tags: [References]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the permission to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nameUz
 *               - nameRu
 *               - permissionGroupId
 *               - resource
 *               - action
 *             properties:
 *               nameUz:
 *                 type: string
 *                 description: Permission name in Uzbek
 *               nameRu:
 *                 type: string
 *                 description: Permission name in Russian
 *               permissionGroupId:
 *                 type: integer
 *                 description: Permission group ID
 *               resource:
 *                 type: string
 *                 description: Resource name
 *               action:
 *                 type: string
 *                 description: Action name
 *     responses:
 *       200:
 *         description: Permission updated successfully
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
		const { nameUz, nameRu, permissionGroupId, action, resource } = req.body;

		await db
			.update(referencesPermissionsTable)
			.set({
				nameUz,
				nameRu,
				permissionGroupId,
				action,
				resource,
				updatedAt: new Date(),
			})
			.where(eq(referencesPermissionsTable.id, Number(id)))
			.returning();

		res.json({ message: 'Permission updated successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
