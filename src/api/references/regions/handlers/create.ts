import { Request, Response } from 'express';
import { CreatePayload } from '../validators';
import { referencesRegionsTable } from '../../../../db/schemas/references/regions';
import db from '../../../../db';
import { handleError } from '../../../../utils/handleError';

export const createHandler = async (
	req: Request<{}, {}, CreatePayload>,
	res: Response
) => {
	try {
		const { nameUz, nameRu, countryId } = req.body;

		const result = await db
			.insert(referencesRegionsTable)
			.values({
				nameUz,
				nameRu,
				countryId,
			})
			.returning();

		res.status(201).json(result[0]);
	} catch (error) {
		handleError(res, error);
	}
};
