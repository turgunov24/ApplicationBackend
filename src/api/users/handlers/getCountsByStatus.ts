import { Request, Response } from 'express';
import db from '../../../db';
import { usersTable, statuses } from '../../../db/schemas/users';
import { eq, count, ne } from 'drizzle-orm';
import { handleError } from '../../../utils/handleError';

/**
 * @swagger
 * /api/users/counts-by-status:
 *   get:
 *     summary: Get counts of users by status (and total count)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 all:
 *                   type: integer
 *                   description: Total count of all users (excluding deleted)
 *                 active:
 *                   type: integer
 *                   description: Count of active users
 *                 deleted:
 *                   type: integer
 *                   description: Count of deleted users
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 */

export const getCountsByStatusHandler = async (req: Request, res: Response) => {
	try {
		// Get total count (excluding deleted)
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
		handleError(res, error);
	}
};
