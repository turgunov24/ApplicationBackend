import { Request, Response } from 'express';
import { CreatePayload } from '../validators';
import { referencesRolesTable } from '../../../../db/schemas/references/roles';
import db from '../../../../db';
import { handleError } from '../../../../utils/handleError';

export const createHandler = async (
	req: Request<{}, {}, CreatePayload>,
	res: Response
) => {
	try {
		const { nameUz, nameRu, descriptionUz, descriptionRu } = req.body;

		const result = await db
			.insert(referencesRolesTable)
			.values({
				nameUz,
				nameRu,
				descriptionUz,
				descriptionRu,
			})
			.returning();

		res.status(201).json(result[0]);
	} catch (error) {
		handleError(res, error);
	}
};
