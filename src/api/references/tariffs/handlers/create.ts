import { Request, Response } from 'express';
import { CreatePayload } from '../validators';
import { referencesTariffsTable } from '../../../../db/schemas/references/tariffs';
import db from '../../../../db';
import { handleError } from '../../../../utils/handleError';

export const createHandler = async (
	req: Request<{}, {}, CreatePayload>,
	res: Response,
) => {
	try {
		const { nameUz, nameRu, monthlyPrice, currencyId } = req.body;

		const result = await db
			.insert(referencesTariffsTable)
			.values({
				nameUz,
				nameRu,
				monthlyPrice,
				currencyId,
			})
			.returning();

		res.status(201).json(result[0]);
	} catch (error) {
		handleError(res, error);
	}
};
