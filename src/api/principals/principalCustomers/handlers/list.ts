import { Request, Response } from 'express';
import db from '../../../../db';
import { principalCustomersTable } from '../../../../db/schemas/principalCustomers';
import { handleError } from '../../../../utils/handleError';
import { asc, and, eq, ne } from 'drizzle-orm';
import { generateErrorMessage } from '../../../../utils/generateErrorMessage';

export const listHandler = async (req: Request, res: Response) => {
	try {
		const principal = req.principal;

		if (!principal)
			return res.status(401).json(generateErrorMessage('Unauthorized'));

		const whereConditions = [ne(principalCustomersTable.status, 'deleted')];

		whereConditions.push(eq(principalCustomersTable.principalId, principal.id));

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
