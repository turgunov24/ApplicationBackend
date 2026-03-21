import { Request, Response } from 'express';
import { CreatePayload } from '../validators';
import { referencesPrincipalCustomerCredentialsTable } from '../../../../../db/schemas/references/principalCustomerCredentials';
import db from '../../../../../db';
import { handleError } from '../../../../../utils/handleError';
import { getAuthUserId } from '../../../../../utils/getAuthUserId';
import { generateErrorMessage } from '../../../../../utils/generateErrorMessage';

export const createHandler = async (
	req: Request<{}, {}, CreatePayload>,
	res: Response,
) => {
	try {
		const {
			serviceId,
			username,
			password,
			additionalInformationUz,
			additionalInformationRu,
			principalCustomerId,
		} = req.body;

		const userId = getAuthUserId(req);

		if (!userId)
			return res.status(401).json(generateErrorMessage('Unauthorized'));

		const result = await db
			.insert(referencesPrincipalCustomerCredentialsTable)
			.values({
				createdBy: userId,
				serviceId,
				username,
				password,
				additionalInformationUz,
				additionalInformationRu,
				principalCustomerId,
			})
			.returning();

		res.status(201).json(result[0]);
	} catch (error) {
		handleError(res, error);
	}
};
