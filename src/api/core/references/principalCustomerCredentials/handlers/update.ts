import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { CreatePayload } from '../validators';
import { referencesPrincipalCustomerCredentialsTable } from '../../../../../db/schemas/references/principalCustomerCredentials';
import db from '../../../../../db';
import { handleError } from '../../../../../utils/handleError';

export const updateHandler = async (
	req: Request<{}, {}, CreatePayload, { id: string }>,
	res: Response,
) => {
	try {
		const { id } = req.query;
		const {
			serviceId,
			username,
			password,
			additionalInformationUz,
			additionalInformationRu,
			principalCustomerId,
		} = req.body;

		await db
			.update(referencesPrincipalCustomerCredentialsTable)
			.set({
				serviceId,
				username,
				password,
				additionalInformationUz,
				additionalInformationRu,
				principalCustomerId,
				updatedAt: new Date(),
			})
			.where(eq(referencesPrincipalCustomerCredentialsTable.id, Number(id)))
			.returning();

		res.json({ message: 'Credential updated successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
