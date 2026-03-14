import { Request, Response } from 'express';
import { eq, and, count, inArray, ne } from 'drizzle-orm';
import db from '../../../../db';
import { principalCustomersTable } from '../../../../db/schemas';
import { referencesLegalFormsTable } from '../../../../db/schemas/references/legalForms';
import { statuses } from '../../../../db/schemas/references/legalForms';
import { handleError } from '../../../../utils/handleError';
import { generateErrorMessage } from '../../../../utils/generateErrorMessage';

export const getCountsByStatusHandler = async (req: Request, res: Response) => {
	try {
		const principal = req.principal;

		if (!principal)
			return res.status(401).json(generateErrorMessage('Unauthorized'));

		const principalCustomers = await db
			.select({
				legalFormId: principalCustomersTable.legalFormId,
			})
			.from(principalCustomersTable)
			.where(
				and(
					eq(principalCustomersTable.principalId, principal.id),
					ne(principalCustomersTable.status, 'deleted'),
				),
			);

		const legalFormIds = principalCustomers.map((pc) => pc.legalFormId);

		const whereConditions = [];

		if (legalFormIds.length > 0) {
			whereConditions.push(
				inArray(referencesLegalFormsTable.id, legalFormIds),
			);
		}

		const whereClause =
			whereConditions.length > 0 ? and(...whereConditions) : undefined;

		const totalCountResult = await db
			.select({ count: count() })
			.from(referencesLegalFormsTable)
			.where(whereClause);

		const totalCount = totalCountResult[0].count;

		const statusCounts: Record<string, number> = {
			all: totalCount,
		};

		for (const status of statuses) {
			const statusCountResult = await db
				.select({ count: count() })
				.from(referencesLegalFormsTable)
				.where(
					and(
						...whereConditions,
						eq(referencesLegalFormsTable.status, status),
					),
				);

			statusCounts[status] = statusCountResult[0].count;
		}

		res.json(statusCounts);
	} catch (error: unknown) {
		handleError(res, error);
	}
};
