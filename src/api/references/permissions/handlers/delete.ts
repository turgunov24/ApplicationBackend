import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { referencesPermissionsTable } from '../../../../db/schemas/references/permissions';
import db from '../../../../db';
import { handleError } from '../../../../utils/handleError';

/**
 * @swagger
 * /api/references/permissions/delete:
 *   delete:
 *     summary: Soft-delete a permission by setting its status to 'deleted'
 *     tags: [References - Permissions]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the permission to delete
 *     responses:
 *       200:
 *         description: Permission deleted successfully
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

export const deleteHandler = async (
	req: Request<{}, {}, {}, { id: string }>,
	res: Response
) => {
	try {
		const { id } = req.query;

		await db
			.update(referencesPermissionsTable)
			.set({ status: 'deleted', updatedAt: new Date() })
			.where(eq(referencesPermissionsTable.id, Number(id)))
			.returning();

		res.json({ message: 'Permission deleted successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
