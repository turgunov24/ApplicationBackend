import { Request, Response } from 'express';
import { eq, and, count } from 'drizzle-orm';
import db from '../../../../db';
import { principalsTable } from '../../../../db/schemas';
import { referencesPrincipalCustomerCredentialsTable } from '../../../../db/schemas/references/principalCustomerCredentials';
import { statuses } from '../../../../db/schemas/references/principalCustomerCredentials';
import { handleError } from '../../../../utils/handleError';
import { generateErrorMessage } from '../../../../utils/generateErrorMessage';

export const getCountsByStatusHandler = async (req: Request, res: Response) => {
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

		const whereConditions = [
			eq(referencesPrincipalCustomerCredentialsTable.createdBy, adminId),
		];

		const whereClause =
			whereConditions.length > 0 ? and(...whereConditions) : undefined;

		const totalCountResult = await db
			.select({ count: count() })
			.from(referencesPrincipalCustomerCredentialsTable)
			.where(whereClause);

		const totalCount = totalCountResult[0].count;

		const statusCounts: Record<string, number> = {
			all: totalCount,
		};

		for (const status of statuses) {
			const statusCountResult = await db
				.select({ count: count() })
				.from(referencesPrincipalCustomerCredentialsTable)
				.where(
					and(
						...whereConditions,
						eq(referencesPrincipalCustomerCredentialsTable.status, status),
					),
				);

			statusCounts[status] = statusCountResult[0].count;
		}

		res.json(statusCounts);
	} catch (error: unknown) {
		handleError(res, error);
	}
};
