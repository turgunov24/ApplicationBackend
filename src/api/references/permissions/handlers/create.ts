import { Request, Response } from 'express';
import { CreatePayload } from '../validators';
import { referencesPermissionsTable } from '../../../../db/schemas/references/permissions';
import db from '../../../../db';
import { handleError } from '../../../../utils/handleError';

export const createHandler = async (
	req: Request<{}, {}, CreatePayload>,
	res: Response
) => {
	try {
		const { nameUz, nameRu, permissionGroupId, resource, action } = req.body;

		const result = await db
			.insert(referencesPermissionsTable)
			.values({
				resource,
				action,
				nameUz,
				nameRu,
				permissionGroupId,
			})
			.returning();

		res.status(201).json(result[0]);
	} catch (error) {
		handleError(res, error);
	}
};
