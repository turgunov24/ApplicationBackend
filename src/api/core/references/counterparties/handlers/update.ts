import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { CreatePayload } from '../validators';
import { referencesCounterpartiesTable } from '../../../../../db/schemas/references/counterparties';
import db from '../../../../../db';
import { handleError } from '../../../../../utils/handleError';

export const updateHandler = async (
	req: Request<{}, {}, CreatePayload, { id: string }>,
	res: Response,
) => {
	try {
		const { id } = req.query;
		const { name } = req.body;

		await db
			.update(referencesCounterpartiesTable)
			.set({
				name,
				updatedAt: new Date(),
			})
			.where(eq(referencesCounterpartiesTable.id, Number(id)))
			.returning();

		res.json({ message: 'Counterparty updated successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
