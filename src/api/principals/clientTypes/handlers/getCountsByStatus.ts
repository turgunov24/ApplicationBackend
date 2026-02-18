import { Request, Response } from 'express';
import { eq, and, count, inArray, ne } from 'drizzle-orm';
import db from '../../../../db';
import { principalCustomersTable } from '../../../../db/schemas';
import { referencesClientTypesTable } from '../../../../db/schemas/references/clientTypes';
import { statuses } from '../../../../db/schemas/references/clientTypes';
import { handleError } from '../../../../utils/handleError';
import { generateErrorMessage } from '../../../../utils/generateErrorMessage';

export const getCountsByStatusHandler = async (req: Request, res: Response) => {
	try {
		const principal = req.principal;

		if (!principal)
			return res.status(401).json(generateErrorMessage('Unauthorized'));

		const principalCustomers = await db
			.select({ clientTypeId: principalCustomersTable.clientTypeId })
			.from(principalCustomersTable)
			.where(
				and(
					eq(principalCustomersTable.principalId, principal.id),
					ne(principalCustomersTable.status, 'deleted'),
				),
			);

		const clientTypeIds = principalCustomers.map((pc) => pc.clientTypeId);

		const whereConditions = [];

		if (clientTypeIds.length > 0) {
			whereConditions.push(
				inArray(referencesClientTypesTable.id, clientTypeIds),
			);
		}

		const whereClause =
			whereConditions.length > 0 ? and(...whereConditions) : undefined;

		const totalCountResult = await db
			.select({ count: count() })
			.from(referencesClientTypesTable)
			.where(whereClause);

		const totalCount = totalCountResult[0].count;

		const statusCounts: Record<string, number> = {
			all: totalCount,
		};

		for (const status of statuses) {
			const statusCountResult = await db
				.select({ count: count() })
				.from(referencesClientTypesTable)
				.where(
					and(
						...whereConditions,
						eq(referencesClientTypesTable.status, status),
					),
				);

			statusCounts[status] = statusCountResult[0].count;
		}

		res.json(statusCounts);
	} catch (error: unknown) {
		handleError(res, error);
	}
};
