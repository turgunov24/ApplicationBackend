import { Request, Response } from 'express';
import db from '../../../../db';
import { referencesCountriesTable } from '../../../../db/schemas';
import { handleError } from '../../../../utils/handleError';
import { ne } from 'drizzle-orm';

export const listHandler = async (req: Request, res: Response) => {
	try {
		const countries = await db
			.select({
				id: referencesCountriesTable.id,
				nameUz: referencesCountriesTable.nameUz,
				nameRu: referencesCountriesTable.nameRu,
			})
			.from(referencesCountriesTable)
			.where(ne(referencesCountriesTable.status, 'deleted'));
		res.json(countries);
	} catch (error) {
		handleError(res, error);
	}
};
