import { Request, Response } from 'express';
import { CreatePayload } from '../validators';
import { referencesPermissionGroupsTable } from '../../../../db/schemas/references/permissionGroups';
import db from '../../../../db';
import { handleError } from '../../../../utils/handleError';

export const createHandler = async (
	req: Request<{}, {}, CreatePayload>,
	res: Response
) => {
	try {
		const { nameUz, nameRu } = req.body;

		const result = await db
			.insert(referencesPermissionGroupsTable)
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
