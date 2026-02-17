import { Request, Response } from 'express';
import { eq, and, count } from 'drizzle-orm';
import db from '../../../../../db';
import { referencesPermissionGroupsTable } from '../../../../../db/schemas';
import { statuses } from '../../../../../db/schemas/references/permissionGroups';
import { handleError } from '../../../../../utils/handleError';
import { getAuthUserId } from '../../../../../utils/getAuthUserId';
import { generateErrorMessage } from '../../../../../utils/generateErrorMessage';
import { SUPER_ADMIN_ID } from '../../../../../helpers/config';

/**
 * @swagger
 * /api/references/permission-groups/counts-by-status:
 *   get:
 *     summary: Get counts of permission groups by status (and total count)
 *     tags: [References - Permission Groups]
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
 *                   description: Total count of all permission groups
 *                 active:
 *                   type: integer
 *                   description: Count of active permission groups
 *                 deleted:
 *                   type: integer
 *                   description: Count of deleted permission groups
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
			whereConditions.push(
				eq(referencesPermissionGroupsTable.createdBy, userId),
			);
		}

		const whereClause =
			whereConditions.length > 0 ? and(...whereConditions) : undefined;

		// Get total count
		const totalCountResult = await db
			.select({ count: count() })
			.from(referencesPermissionGroupsTable)
			.where(whereClause);

		const totalCount = totalCountResult[0].count;

		// Get count for each status
		const statusCounts: Record<string, number> = {
			all: totalCount,
		};

		for (const status of statuses) {
			const statusCountResult = await db
				.select({ count: count() })
				.from(referencesPermissionGroupsTable)
				.where(
					and(
						...whereConditions,
						eq(referencesPermissionGroupsTable.status, status),
					),
				);

			statusCounts[status] = statusCountResult[0].count;
		}

		res.json(statusCounts);
	} catch (error: unknown) {
		handleError(res, error);
	}
};
