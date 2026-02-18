import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { CreatePayload } from '../validators';
import { principalCustomersTable } from '../../../../db/schemas/principalCustomers';
import db from '../../../../db';
import { handleError } from '../../../../utils/handleError';

export const updateHandler = async (
	req: Request<{}, {}, CreatePayload, { id: string }>,
	res: Response,
) => {
	try {
		const { id } = req.query;
		const { name, principalId, clientTypeId } = req.body;

		await db
			.update(principalCustomersTable)
			.set({
				name,
				principalId,
				clientTypeId,
				updatedAt: new Date(),
			})
			.where(eq(principalCustomersTable.id, Number(id)))
			.returning();

		res.json({ message: 'Principal customer updated successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
