import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { CreatePayload } from '../validators';
import { referencesPrincipalCustomerCredentialsTable } from '../../../../../db/schemas/references/principalCustomerCredentials';
import db from '../../../../../db';
import { handleError } from '../../../../../utils/handleError';
import bcrypt from 'bcryptjs';

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

		let hashedPassword = undefined;

		if (password) {
			hashedPassword = await bcrypt.hash(password, 10);
			await db
				.update(referencesPrincipalCustomerCredentialsTable)
				.set({
					serviceId,
					username,
					password: hashedPassword,
					additionalInformationUz,
					additionalInformationRu,
					principalCustomerId,
					updatedAt: new Date(),
				})
				.where(eq(referencesPrincipalCustomerCredentialsTable.id, Number(id)))
				.returning();
		} else {
			await db
				.update(referencesPrincipalCustomerCredentialsTable)
				.set({
					serviceId,
					username,
					additionalInformationUz,
					additionalInformationRu,
					principalCustomerId,
					updatedAt: new Date(),
				})
				.where(eq(referencesPrincipalCustomerCredentialsTable.id, Number(id)))
				.returning();
		}

		res.json({ message: 'Credential updated successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
