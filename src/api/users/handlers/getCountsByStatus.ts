import { Request, Response } from 'express';
import db from '../../../db';
import { usersTable, statuses } from '../../../db/schemas/users';
import { eq, count, ne } from 'drizzle-orm';
import { generateErrorMessage } from '../../../utils/generateErrorMessage'

export const getCountsByStatusHandler = async (req: Request, res: Response) => {
	try {
		// Get total count
		const totalCountResult = await db
			.select({ count: count() })
			.from(usersTable)
			.where(ne(usersTable.status, 'deleted'));

		const totalCount = totalCountResult[0].count;

		// Get count for each status
		const statusCounts: Record<string, number> = {
			all: totalCount,
		};

		for (const status of statuses) {
			const statusCountResult = await db
				.select({ count: count() })
				.from(usersTable)
				.where(eq(usersTable.status, status));

			statusCounts[status] = statusCountResult[0].count;
		}

		res.json(statusCounts);
	} catch (error: unknown) {
		if (error instanceof Error) {
			res.status(500).json(generateErrorMessage(error.message));
		} else {
			res.status(500).json(generateErrorMessage('Internal server error'));
		}
	}
};
