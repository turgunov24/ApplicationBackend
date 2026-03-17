import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { referencesPrincipalCustomerCredentialsTable } from '../../../../../db/schemas/references/principalCustomerCredentials';
import db from '../../../../../db';
import { handleError } from '../../../../../utils/handleError';

export const deleteHandler = async (
	req: Request<{}, {}, {}, { id: string }>,
	res: Response,
) => {
	try {
		const { id } = req.query;

		await db
			.update(referencesPrincipalCustomerCredentialsTable)
			.set({ status: 'deleted', updatedAt: new Date() })
			.where(eq(referencesPrincipalCustomerCredentialsTable.id, Number(id)))
			.returning();

		res.json({ message: 'Credential deleted successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
