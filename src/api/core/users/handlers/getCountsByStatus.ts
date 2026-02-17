import { Request, Response } from 'express';
import db from '../../../../db';
import { usersTable, statuses } from '../../../../db/schemas/users';
import { eq, count, ne, and } from 'drizzle-orm';
import { handleError } from '../../../../utils/handleError';
import { getAuthUserId } from '../../../../utils/getAuthUserId';
import { generateErrorMessage } from '../../../../utils/generateErrorMessage';
import { SUPER_ADMIN_ID } from '../../../../helpers/config';

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
		const userId = getAuthUserId(req);

		if (!userId)
			return res.status(401).json(generateErrorMessage('Unauthorized'));

		const whereConditions = [];

		if (userId !== SUPER_ADMIN_ID) {
			whereConditions.push(eq(usersTable.createdBy, userId));
		}

		const whereClause =
			whereConditions.length > 0 ? and(...whereConditions) : undefined;

		// Get total count (excluding deleted)
		const totalCountResult = await db
			.select({ count: count() })
			.from(usersTable)
			.where(and(ne(usersTable.status, 'deleted'), whereClause));

		const totalCount = totalCountResult[0].count;

		// Get count for each status
		const statusCounts: Record<string, number> = {
			all: totalCount,
		};

		for (const status of statuses) {
			const statusCountResult = await db
				.select({ count: count() })
				.from(usersTable)
				.where(and(eq(usersTable.status, status), whereClause));

			statusCounts[status] = statusCountResult[0].count;
		}

		res.json(statusCounts);
	} catch (error: unknown) {
		handleError(res, error);
	}
};
