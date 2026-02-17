import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { referencesRegionsTable } from '../../../../../db/schemas/references/regions';
import db from '../../../../../db';
import { handleError } from '../../../../../utils/handleError';

/**
 * @swagger
 * /api/references/regions/delete:
 *   delete:
 *     summary: Soft-delete a region by setting its status to 'deleted'
 *     tags: [References - Regions]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the region to delete
 *     responses:
 *       200:
 *         description: Region deleted successfully
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
			.update(referencesRegionsTable)
			.set({ status: 'deleted', updatedAt: new Date() })
			.where(eq(referencesRegionsTable.id, Number(id)))
			.returning();

		res.json({ message: 'Region deleted successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
