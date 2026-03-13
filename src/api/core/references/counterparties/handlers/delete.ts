import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { referencesCounterpartiesTable } from '../../../../../db/schemas/references/counterparties';
import db from '../../../../../db';
import { handleError } from '../../../../../utils/handleError';

export const deleteHandler = async (
	req: Request<{}, {}, {}, { id: string }>,
	res: Response,
) => {
	try {
		const { id } = req.query;

		await db
			.update(referencesCounterpartiesTable)
			.set({ status: 'deleted', updatedAt: new Date() })
			.where(eq(referencesCounterpartiesTable.id, Number(id)))
			.returning();

		res.json({ message: 'Counterparty deleted successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
