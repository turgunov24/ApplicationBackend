import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { referencesCountriesTable } from '../../../../db/schemas/references/countries';
import db from '../../../../db';
import { handleError } from '../../../../utils/handleError';

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
