import { Request, Response } from 'express';
import { eq, count, ne, and } from 'drizzle-orm';
import db from '../../../../db';
import { referencesDistrictsTable } from '../../../../db/schemas';
import { statuses } from '../../../../db/schemas/references/districts';
import { handleError } from '../../../../utils/handleError';

export const getCountsByStatusHandler = async (req: Request, res: Response) => {
	try {
		// Get total count
		const totalCountResult = await db
			.select({ count: count() })
			.from(referencesDistrictsTable)
			.where(ne(referencesDistrictsTable.status, 'deleted'));

		const totalCount = totalCountResult[0].count;

		// Get count for each status
		const statusCounts: Record<string, number> = {
			all: totalCount,
		};

		for (const status of statuses) {
			const statusCountResult = await db
				.select({ count: count() })
				.from(referencesDistrictsTable)
				.where(and(eq(referencesDistrictsTable.status, status)));

			statusCounts[status] = statusCountResult[0].count;
		}

		res.json(statusCounts);
	} catch (error: unknown) {
		handleError(res, error);
	}
};
