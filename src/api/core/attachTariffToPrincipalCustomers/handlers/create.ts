import { Request, Response } from 'express';
import { CreatePayload } from '../validators';
import { referencesAttachTariffToPrincipalCustomersTable } from '../../../../db/schemas/references/attachTariffToPrincipalCustomers';
import db from '../../../../db';
import { handleError } from '../../../../utils/handleError';
import { getAuthUserId } from '../../../../utils/getAuthUserId';
import { generateErrorMessage } from '../../../../utils/generateErrorMessage';

export const createHandler = async (
	req: Request<{}, {}, CreatePayload>,
	res: Response,
) => {
	try {
		const {
			principalCustomerId,
			tariffId,
			startDate,
			endDate,
		} = req.body;

		const userId = getAuthUserId(req);

		if (!userId)
			return res.status(401).json(generateErrorMessage('Unauthorized'));

		const result = await db
			.insert(referencesAttachTariffToPrincipalCustomersTable)
			.values({
				createdBy: userId,
				principalCustomerId,
				tariffId,
				startDate: startDate ? new Date(startDate) : undefined,
				endDate: endDate ? new Date(endDate) : undefined,
			})
			.returning();

		res.status(201).json(result[0]);
	} catch (error) {
		handleError(res, error);
	}
};
