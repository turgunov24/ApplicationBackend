import { Request, Response } from 'express';
import db from '../../../../db';
import { principalsTable } from '../../../../db/schemas';
import { referencesCurrenciesTable } from '../../../../db/schemas/references/currencies';
import { handleError } from '../../../../utils/handleError';
import { and, asc, eq, ne } from 'drizzle-orm';
import { generateErrorMessage } from '../../../../utils/generateErrorMessage';

export const listHandler = async (req: Request, res: Response) => {
	try {
		const principal = req.principal;

		if (!principal)
			return res.status(401).json(generateErrorMessage('Unauthorized'));

		// Principalni DB dan topib, createdBy (admin ID) ni olamiz
		const principalRecord = await db.query.principalsTable.findFirst({
			where: eq(principalsTable.id, principal.id),
			columns: {
				createdBy: true,
			},
		});

		if (!principalRecord)
			return res
				.status(404)
				.json(generateErrorMessage('Principal not found'));

		const adminId = principalRecord.createdBy;

		// O'sha admin yaratgan currencies ni qaytaramiz
		const currencies =
			await db.query.referencesCurrenciesTable.findMany({
				where: and(
					ne(referencesCurrenciesTable.status, 'deleted'),
					eq(referencesCurrenciesTable.createdBy, adminId),
				),
				orderBy: asc(referencesCurrenciesTable.createdAt),
				columns: {
					id: true,
					nameUz: true,
					nameRu: true,
				},
			});
		res.json(currencies);
	} catch (error) {
		handleError(res, error);
	}
};
