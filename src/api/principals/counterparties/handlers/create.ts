import { Request, Response } from 'express';
import { CreatePayload } from '../validators';
import { eq } from 'drizzle-orm';
import { principalsTable } from '../../../../db/schemas';
import { referencesCounterpartiesTable } from '../../../../db/schemas/references/counterparties';
import db from '../../../../db';
import { handleError } from '../../../../utils/handleError';
import { generateErrorMessage } from '../../../../utils/generateErrorMessage';

export const createHandler = async (
	req: Request<{}, {}, CreatePayload>,
	res: Response,
) => {
	try {
		const { name, phone } = req.body;

		const principal = req.principal;

		if (!principal)
			return res.status(401).json(generateErrorMessage('Unauthorized'));

		const principalRecord = await db.query.principalsTable.findFirst({
			where: eq(principalsTable.id, principal.id),
			columns: {
				createdBy: true,
			},
		});

		if (!principalRecord)
			return res.status(404).json(generateErrorMessage('Principal not found'));

		const result = await db
			.insert(referencesCounterpartiesTable)
			.values({
				createdBy: principalRecord.createdBy,
				principalId: principal.id,
				name,
				phone,
			})
			.returning();

		res.status(201).json(result[0]);
	} catch (error) {
		handleError(res, error);
	}
};
