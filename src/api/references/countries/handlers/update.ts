import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { CreatePayload } from '../validators';
import { referencesCountriesTable } from '../../../../db/schemas/references/countries';
import db from '../../../../db';
import { handleError } from '../../../../utils/handleError';

export const updateHandler = async (
	req: Request<{}, {}, CreatePayload, { id: string }>,
	res: Response
) => {
	try {
		const { id } = req.query;
		const { nameUz, nameRu } = req.body;

		await db
			.update(referencesCountriesTable)
			.set({
				nameUz,
				nameRu,
				updatedAt: new Date(),
			})
			.where(eq(referencesCountriesTable.id, Number(id)))
			.returning();

		res.json({ message: 'Country updated successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
