import { Request, Response } from 'express';
import db from '../../../../db';
import { principalCustomersTable } from '../../../../db/schemas/principalCustomers';
import { handleError } from '../../../../utils/handleError';
import { asc, and, eq, ne } from 'drizzle-orm';
import { getAuthUserId } from '../../../../utils/getAuthUserId';
import { generateErrorMessage } from '../../../../utils/generateErrorMessage';
import { SUPER_ADMIN_ID } from '../../../../helpers/config';

export const listHandler = async (req: Request, res: Response) => {
	try {
		const userId = getAuthUserId(req);

		if (!userId)
			return res.status(401).json(generateErrorMessage('Unauthorized'));

		const whereConditions = [ne(principalCustomersTable.status, 'deleted')];

		if (userId !== SUPER_ADMIN_ID) {
			whereConditions.push(eq(principalCustomersTable.createdBy, userId));
		}

		const principalCustomers = await db.query.principalCustomersTable.findMany({
			where: and(...whereConditions),
			orderBy: asc(principalCustomersTable.createdAt),
			columns: {
				id: true,
				name: true,
			},
		});
		res.json(principalCustomers);
	} catch (error) {
		handleError(res, error);
	}
};
