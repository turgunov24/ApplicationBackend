import { Request, Response } from 'express';
import { usersTable } from '../../../db/schemas/users';
import db from '../../../db';
import { eq } from 'drizzle-orm';
import { handleError } from '../../../utils/handleError';

/**
 * @swagger
 * /api/users/delete:
 *   delete:
 *     summary: Soft-delete a user by setting its status to 'deleted'
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
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
			.update(usersTable)
			.set({ status: 'deleted', updatedAt: new Date() })
			.where(eq(usersTable.id, Number(id)))
			.returning();

		res.json({ message: 'User deleted successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
