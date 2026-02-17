import { Request, Response } from 'express';
import { eq, and, count } from 'drizzle-orm';
import db from '../../../../../db';
import { referencesClientTypesTable } from '../../../../../db/schemas';
import { statuses } from '../../../../../db/schemas/references/clientTypes';
import { handleError } from '../../../../../utils/handleError';
import { getAuthUserId } from '../../../../../utils/getAuthUserId';
import { generateErrorMessage } from '../../../../../utils/generateErrorMessage';
import { SUPER_ADMIN_ID } from '../../../../../helpers/config';

export const getCountsByStatusHandler = async (req: Request, res: Response) => {
	try {
		const userId = getAuthUserId(req);

		if (!userId)
			return res.status(401).json(generateErrorMessage('Unauthorized'));

		const whereConditions = [];

		if (userId !== SUPER_ADMIN_ID) {
			whereConditions.push(eq(referencesClientTypesTable.createdBy, userId));
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
