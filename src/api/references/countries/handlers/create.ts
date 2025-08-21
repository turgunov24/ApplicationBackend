import { Request, Response } from 'express';
import { CreatePayload } from '../validators';
import { referencesCountriesTable } from '../../../../db/schemas/references/countries';
import db from '../../../../db';
import { handleError } from '../../../../utils/handleError';

export const createHandler = async (
	req: Request<{}, {}, CreatePayload>,
	res: Response
) => {
	try {
		const { nameUz, nameRu } = req.body;

		const result = await db
			.insert(referencesCountriesTable)
			.values({
				nameUz,
				nameRu,
			})
			.returning();

		res.status(201).json(result[0]);
	} catch (error) {
		handleError(res, error);
	}
};
