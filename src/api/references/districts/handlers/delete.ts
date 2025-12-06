import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { referencesDistrictsTable } from '../../../../db/schemas/references/districts';
import db from '../../../../db';
import { handleError } from '../../../../utils/handleError';

/**
 * @swagger
 * /api/references/districts/delete:
 *   delete:
 *     summary: Soft-delete a district by setting its status to 'deleted'
 *     tags: [References]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the district to delete
 *     responses:
 *       200:
 *         description: District deleted successfully
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
			.update(referencesDistrictsTable)
			.set({ status: 'deleted', updatedAt: new Date() })
			.where(eq(referencesDistrictsTable.id, Number(id)))
			.returning();

		res.json({ message: 'District deleted successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
