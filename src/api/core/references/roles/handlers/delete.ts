import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { referencesRolesTable } from '../../../../../db/schemas/references/roles';
import db from '../../../../../db';
import { handleError } from '../../../../../utils/handleError';

/**
 * @swagger
 * /api/references/roles/delete:
 *   delete:
 *     summary: Soft-delete a role by setting its status to 'deleted'
 *     tags: [References - Roles]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the role to delete
 *     responses:
 *       200:
 *         description: Role deleted successfully
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
			.update(referencesRolesTable)
			.set({ status: 'deleted', updatedAt: new Date() })
			.where(eq(referencesRolesTable.id, Number(id)))
			.returning();

		res.json({ message: 'Role deleted successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
