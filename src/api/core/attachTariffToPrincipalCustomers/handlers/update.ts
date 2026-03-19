import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { CreatePayload } from '../validators';
import { referencesAttachTariffToPrincipalCustomersTable } from '../../../../db/schemas/references/attachTariffToPrincipalCustomers';
import db from '../../../../db';
import { handleError } from '../../../../utils/handleError';

export const updateHandler = async (
	req: Request<{}, {}, CreatePayload, { id: string }>,
	res: Response,
) => {
	try {
		const { id } = req.query;
		const {
			principalCustomerId,
			tariffId,
			startDate,
			endDate,
		} = req.body;

		await db
			.update(referencesAttachTariffToPrincipalCustomersTable)
			.set({
				principalCustomerId,
				tariffId,
				startDate: startDate ? new Date(startDate) : undefined,
				endDate: endDate ? new Date(endDate) : undefined,
				updatedAt: new Date(),
			})
			.where(eq(referencesAttachTariffToPrincipalCustomersTable.id, Number(id)))
			.returning();

		res.json({ message: 'Attach tariff to principal customer updated successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
