import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { principalCustomersTable } from '../../../../db/schemas/principalCustomers';
import db from '../../../../db';
import { handleError } from '../../../../utils/handleError';

export const deleteHandler = async (
	req: Request<{}, {}, {}, { id: string }>,
	res: Response,
) => {
	try {
		const { id } = req.query;

		await db
			.update(principalCustomersTable)
			.set({ status: 'deleted', updatedAt: new Date() })
			.where(eq(principalCustomersTable.id, Number(id)))
			.returning();

		res.json({ message: 'Principal customer deleted successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
