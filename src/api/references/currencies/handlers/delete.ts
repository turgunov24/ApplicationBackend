import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { referencesCurrenciesTable } from '../../../../db/schemas/references/currencies';
import db from '../../../../db';
import { handleError } from '../../../../utils/handleError';

/**
 * @swagger
 * /api/references/currencies/delete:
 *   delete:
 *     summary: Soft-delete a currency by setting its status to 'deleted'
 *     tags: [References - Currencies]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the currency to delete
 *     responses:
 *       200:
 *         description: Currency deleted successfully
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
	res: Response,
) => {
	try {
		const { id } = req.query;

		await db
			.update(referencesCurrenciesTable)
			.set({ status: 'deleted', updatedAt: new Date() })
			.where(eq(referencesCurrenciesTable.id, Number(id)))
			.returning();

		res.json({ message: 'Currency deleted successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
