import { Request, Response } from 'express';
import { CreatePayload } from '../validators';
import { referencesTariffsTable } from '../../../../../db/schemas/references/tariffs';
import db from '../../../../../db';
import { handleError } from '../../../../../utils/handleError';
import { getAuthUserId } from '../../../../../utils/getAuthUserId';
import { generateErrorMessage } from '../../../../../utils/generateErrorMessage';

export const createHandler = async (
	req: Request<{}, {}, CreatePayload>,
	res: Response,
) => {
	try {
		const { nameUz, nameRu, monthlyPrice, currencyId } = req.body;

		const userId = getAuthUserId(req);

		if (!userId)
			return res.status(401).json(generateErrorMessage('Unauthorized'));

		const result = await db
			.insert(referencesTariffsTable)
			.values({
				createdBy: userId,
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
