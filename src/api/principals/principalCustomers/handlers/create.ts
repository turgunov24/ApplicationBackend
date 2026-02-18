import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { CreatePayload } from '../validators';
import { principalCustomersTable } from '../../../../db/schemas/principalCustomers';
import { principalsTable } from '../../../../db/schemas';
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

		// Principal ni yaratgan admin ID ni topamiz
		const principalRecord = await db.query.principalsTable.findFirst({
			where: eq(principalsTable.id, principal.id),
			columns: {
				createdBy: true,
			},
		});

		if (!principalRecord)
			return res.status(404).json(generateErrorMessage('Principal not found'));

		const result = await db
			.insert(principalCustomersTable)
			.values({
				createdBy: principalRecord.createdBy,
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
