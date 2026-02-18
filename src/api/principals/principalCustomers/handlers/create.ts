import { Request, Response } from 'express';
import { CreatePayload } from '../validators';
import { principalCustomersTable } from '../../../../db/schemas/principalCustomers';
import db from '../../../../db';
import { handleError } from '../../../../utils/handleError';
import { generateErrorMessage } from '../../../../utils/generateErrorMessage';

export const createHandler = async (
	req: Request<{}, {}, CreatePayload>,
	res: Response,
) => {
	try {
		const { name, clientTypeId } = req.body;

		const principal = req.principal;

		if (!principal)
			return res.status(401).json(generateErrorMessage('Unauthorized'));

		const result = await db
			.insert(principalCustomersTable)
			.values({
				createdBy: principal.id,
				name,
				principalId: principal.id,
				clientTypeId,
			})
			.returning();

		res.status(201).json(result[0]);
	} catch (error) {
		handleError(res, error);
	}
};
