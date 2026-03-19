import { Request, Response } from 'express';
import db from '../../../../db';
import { referencesAttachTariffToPrincipalCustomersTable } from '../../../../db/schemas';
import { handleError } from '../../../../utils/handleError';
import { and, asc, eq, ne } from 'drizzle-orm';
import { getAuthUserId } from '../../../../utils/getAuthUserId';
import { generateErrorMessage } from '../../../../utils/generateErrorMessage';
import { SUPER_ADMIN_ID } from '../../../../helpers/config';

export const listHandler = async (req: Request, res: Response) => {
	try {
		const userId = getAuthUserId(req);

		if (!userId)
			return res.status(401).json(generateErrorMessage('Unauthorized'));

		const whereConditions = [ne(referencesAttachTariffToPrincipalCustomersTable.status, 'deleted')];

		if (userId !== SUPER_ADMIN_ID) {
			whereConditions.push(eq(referencesAttachTariffToPrincipalCustomersTable.createdBy, userId));
		}

		const records = await db.query.referencesAttachTariffToPrincipalCustomersTable.findMany({
			where: and(...whereConditions),
			orderBy: asc(referencesAttachTariffToPrincipalCustomersTable.createdAt),
			columns: {
				id: true,
				principalCustomerId: true,
				tariffId: true,
				startDate: true,
				endDate: true,
			},
			with: {
				tariff: {
					columns: {
						id: true,
						nameUz: true,
					},
				},
				principalCustomer: {
					columns: {
						id: true,
						name: true,
					},
				},
			},
		});
		res.json(records);
	} catch (error) {
		handleError(res, error);
	}
};
