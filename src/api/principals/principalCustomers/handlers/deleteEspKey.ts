import fs from 'fs';
import { Request, Response } from 'express';
import { eq, and } from 'drizzle-orm';
import { principalCustomersTable } from '../../../../db/schemas/principalCustomers';
import db from '../../../../db';
import { handleError } from '../../../../utils/handleError';
import { generateErrorMessage } from '../../../../utils/generateErrorMessage';

export const deleteEspKeyHandler = async (
	req: Request<{}, {}, {}, { id: string }>,
	res: Response,
) => {
	try {
		const { id } = req.query;
		const principal = req.principal;

		if (!principal)
			return res.status(401).json(generateErrorMessage('Unauthorized'));

		const existingCustomer =
			await db.query.principalCustomersTable.findFirst({
				where: and(
					eq(principalCustomersTable.id, Number(id)),
					eq(principalCustomersTable.principalId, principal.id)
				),
				columns: { espPath: true },
			});

		if (!existingCustomer) {
			return res
				.status(404)
				.json(generateErrorMessage('Principal customer not found'));
		}

		if (!existingCustomer.espPath) {
			return res
				.status(400)
				.json(generateErrorMessage('No ESP Key found for this principal customer'));
		}

		if (fs.existsSync(existingCustomer.espPath)) {
			fs.unlinkSync(existingCustomer.espPath);
		}

		await db
			.update(principalCustomersTable)
			.set({ espPath: null })
			.where(
				and(
					eq(principalCustomersTable.id, Number(id)),
					eq(principalCustomersTable.principalId, principal.id)
				)
			);

		res.json({ message: 'ESP Key deleted successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
