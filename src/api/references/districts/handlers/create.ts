import { Request, Response } from 'express';
import { CreatePayload } from '../validators';
import { referencesDistrictsTable } from '../../../../db/schemas/references/districts';
import db from '../../../../db';
import { handleError } from '../../../../utils/handleError';

export const createHandler = async (
	req: Request<{}, {}, CreatePayload>,
	res: Response
) => {
	try {
		const { nameUz, nameRu, regionId } = req.body;

		const result = await db
			.insert(referencesDistrictsTable)
			.values({
				nameUz,
				nameRu,
				regionId,
			})
			.returning();

		res.status(201).json(result[0]);
	} catch (error) {
		handleError(res, error);
	}
};
