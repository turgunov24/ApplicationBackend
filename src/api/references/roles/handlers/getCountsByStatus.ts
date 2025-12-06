import { Request, Response } from 'express';
import { eq, count } from 'drizzle-orm';
import db from '../../../../db';
import { referencesRolesTable } from '../../../../db/schemas/references/roles';
import { statuses } from '../../../../db/schemas/references/roles';
import { handleError } from '../../../../utils/handleError';

/**
 * @swagger
 * /api/references/roles/counts-by-status:
 *   get:
 *     summary: Get counts of roles by status (and total count)
 *     tags: [References - Roles]
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
 *                   description: Total count of all roles
 *                 active:
 *                   type: integer
 *                   description: Count of active roles
 *                 deleted:
 *                   type: integer
 *                   description: Count of deleted roles
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
				.where(eq(referencesRolesTable.status, status));

			statusCounts[status] = statusCountResult[0].count;
		}

		res.json(statusCounts);
	} catch (error: unknown) {
		handleError(res, error);
	}
};
