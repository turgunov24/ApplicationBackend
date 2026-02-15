import { Request, Response } from 'express';
import db from '../../../db';
import { principalsTable, statuses } from '../../../db/schemas/principals';
import { eq, count, ne, and } from 'drizzle-orm';
import { handleError } from '../../../utils/handleError';
import { getAuthUserId } from '../../../utils/getAuthUserId';
import { generateErrorMessage } from '../../../utils/generateErrorMessage';
import { SUPER_ADMIN_ID } from '../../../helpers/config';

export const getCountsByStatusHandler = async (req: Request, res: Response) => {
	try {
		const userId = getAuthUserId(req);

		if (!userId)
			return res.status(401).json(generateErrorMessage('Unauthorized'));

		const whereConditions = [];

		if (userId !== SUPER_ADMIN_ID) {
			whereConditions.push(eq(principalsTable.createdBy, userId));
		}

		const whereClause =
			whereConditions.length > 0 ? and(...whereConditions) : undefined;

		// Get total count (excluding deleted)
		const totalCountResult = await db
			.select({ count: count() })
			.from(principalsTable)
			.where(and(ne(principalsTable.status, 'deleted'), whereClause));

		const totalCount = totalCountResult[0].count;

		// Get count for each status
		const statusCounts: Record<string, number> = {
			all: totalCount,
		};

		for (const status of statuses) {
			const statusCountResult = await db
				.select({ count: count() })
				.from(principalsTable)
				.where(and(eq(principalsTable.status, status), whereClause));

			statusCounts[status] = statusCountResult[0].count;
		}

		res.json(statusCounts);
	} catch (error: unknown) {
		handleError(res, error);
	}
};
