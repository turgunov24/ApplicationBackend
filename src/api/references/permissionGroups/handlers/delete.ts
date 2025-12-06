import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { referencesPermissionGroupsTable } from '../../../../db/schemas/references/permissionGroups';
import db from '../../../../db';
import { handleError } from '../../../../utils/handleError';

/**
 * @swagger
 * /api/references/permission-groups/delete:
 *   delete:
 *     summary: Soft-delete a permission group by setting its status to 'deleted'
 *     tags: [References]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the permission group to delete
 *     responses:
 *       200:
 *         description: Permission group deleted successfully
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
			.update(referencesPermissionGroupsTable)
			.set({ status: 'deleted', updatedAt: new Date() })
			.where(eq(referencesPermissionGroupsTable.id, Number(id)))
			.returning();

		res.json({ message: 'Permission group deleted successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
