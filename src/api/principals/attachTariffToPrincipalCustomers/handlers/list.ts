import { Request, Response } from 'express';
import db from '../../../../db';
import { principalsTable } from '../../../../db/schemas';
import { referencesAttachTariffToPrincipalCustomersTable } from '../../../../db/schemas/references/attachTariffToPrincipalCustomers';
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
			return res.status(404).json(generateErrorMessage('Principal not found'));

		const adminId = principalRecord.createdBy;

		// O'sha admin yaratgan records ni qaytaramiz
		const records = await db.query.referencesAttachTariffToPrincipalCustomersTable.findMany({
			where: and(
				ne(referencesAttachTariffToPrincipalCustomersTable.status, 'deleted'),
				eq(referencesAttachTariffToPrincipalCustomersTable.createdBy, adminId),
			),
			orderBy: asc(referencesAttachTariffToPrincipalCustomersTable.createdAt),
			columns: {
				id: true,
				principalCustomerId: true,
				tariffId: true,
			},
		});
		res.json(records);
	} catch (error) {
		handleError(res, error);
	}
};
