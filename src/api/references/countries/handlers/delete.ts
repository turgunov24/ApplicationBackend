import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { referencesCountriesTable } from '../../../../db/schemas/references/countries';
import db from '../../../../db';
import { handleError } from '../../../../utils/handleError';

/**
 * @swagger
 * /api/references/countries/delete:
 *   delete:
 *     summary: Soft-delete a country by setting its status to 'deleted'
 *     tags: [References]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the country to delete
 *     responses:
 *       200:
 *         description: Country deleted successfully
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
			.update(referencesCountriesTable)
			.set({ status: 'deleted', updatedAt: new Date() })
			.where(eq(referencesCountriesTable.id, Number(id)))
			.returning();

		res.json({ message: 'Country deleted successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
