import { Request, Response } from 'express';
import { eq, count, and } from 'drizzle-orm';
import db from '../../../../db';
import { referencesRolesTable } from '../../../../db/schemas/references/roles';
import { statuses } from '../../../../db/schemas/references/roles';
import { handleError } from '../../../../utils/handleError';

export const getCountsByStatusHandler = async (req: Request, res: Response) => {
	try {
		const totalCountResult = await db
			.select({ count: count() })
			.from(referencesRolesTable);

		const totalCount = totalCountResult[0].count;

		const statusCounts: Record<string, number> = {
			all: totalCount,
		};

		for (const status of statuses) {
			const statusCountResult = await db
				.select({ count: count() })
				.from(referencesRolesTable)
				.where(and(eq(referencesRolesTable.status, status)));

			statusCounts[status] = statusCountResult[0].count;
		}

		res.json(statusCounts);
	} catch (error: unknown) {
		handleError(res, error);
	}
};
