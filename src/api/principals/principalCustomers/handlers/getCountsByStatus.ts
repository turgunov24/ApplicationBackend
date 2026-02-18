import { Request, Response } from 'express';
import { eq, and, count } from 'drizzle-orm';
import db from '../../../../db';
import { principalCustomersTable } from '../../../../db/schemas/principalCustomers';
import { statuses } from '../../../../db/schemas/principalCustomers';
import { handleError } from '../../../../utils/handleError';
import { generateErrorMessage } from '../../../../utils/generateErrorMessage';

export const getCountsByStatusHandler = async (req: Request, res: Response) => {
	try {
		const principal = req.principal;

		if (!principal)
			return res.status(401).json(generateErrorMessage('Unauthorized'));

		const whereConditions = [];

		whereConditions.push(eq(principalCustomersTable.principalId, principal.id));

		const whereClause =
			whereConditions.length > 0 ? and(...whereConditions) : undefined;

		const totalCountResult = await db
			.select({ count: count() })
			.from(principalCustomersTable)
			.where(whereClause);

		const totalCount = totalCountResult[0].count;

		const statusCounts: Record<string, number> = {
			all: totalCount,
		};

		for (const status of statuses) {
			const statusCountResult = await db
				.select({ count: count() })
				.from(principalCustomersTable)
				.where(
					and(...whereConditions, eq(principalCustomersTable.status, status)),
				);

			statusCounts[status] = statusCountResult[0].count;
		}

		res.json(statusCounts);
	} catch (error: unknown) {
		handleError(res, error);
	}
};
