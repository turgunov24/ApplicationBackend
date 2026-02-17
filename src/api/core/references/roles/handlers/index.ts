import { Request, Response } from 'express';
import { eq, InferSelectModel, ne, or } from 'drizzle-orm';
import { ilike } from 'drizzle-orm';
import { and } from 'drizzle-orm';
import { count } from 'drizzle-orm';
import { asc } from 'drizzle-orm';
import { referencesRolesTable } from '../../../../../db/schemas/references/roles';
import db from '../../../../../db';
import { handleError } from '../../../../../utils/handleError';
import {
	normalizePagination,
	calculatePaginationMeta,
} from '../../../../../utils/pagination';
import { getAuthUserId } from '../../../../../utils/getAuthUserId';
import { generateErrorMessage } from '../../../../../utils/generateErrorMessage';
import { SUPER_ADMIN_ID } from '../../../../../helpers/config';

/**
 * @swagger
 * /api/references/roles:
 *   get:
 *     summary: Get roles list or single role
 *     tags: [References - Roles]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: Role ID to get single role
 *       - in: query
 *         name: currentPage
 *         schema:
 *           type: string
 *           default: '0'
 *         description: Current page number (0-based)
 *       - in: query
 *         name: dataPerPage
 *         schema:
 *           type: string
 *           default: '5'
 *         description: Number of items per page (max 100)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for nameUz or nameRu
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, deleted, all]
 *           default: all
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       nameUz:
 *                         type: string
 *                       nameRu:
 *                         type: string
 *                       descriptionUz:
 *                         type: string
 *                       descriptionRu:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                       status:
 *                         type: string
 *                         enum: [active, deleted]
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     dataPerPage:
 *                       type: integer
 *                     totalData:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     hasNextPage:
 *                       type: boolean
 *                     hasPrevPage:
 *                       type: boolean
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

type IStatuses = Pick<InferSelectModel<typeof referencesRolesTable>, 'status'>;

interface QueryParams {
	[key: string]: string | undefined;
	currentPage: string;
	dataPerPage: string;
	search?: string;
	status?: IStatuses['status'] | 'all';
	id?: string;
}

export const indexHandler = async (
	req: Request<{}, {}, {}, QueryParams>,
	res: Response,
) => {
	try {
		const {
			currentPage = '0',
			dataPerPage = '5',
			search,
			status = 'all',
			id,
		} = req.query;

		const userId = getAuthUserId(req);

		if (!userId)
			return res.status(401).json(generateErrorMessage('Unauthorized'));

		if (id) {
			const role = await db.query.referencesRolesTable.findFirst({
				where: eq(referencesRolesTable.id, Number(id)),
			});

			return res.json(role);
		}

		const whereConditions = [];

		if (userId !== SUPER_ADMIN_ID) {
			whereConditions.push(eq(referencesRolesTable.createdBy, userId));
		}

		if (status !== 'all') {
			whereConditions.push(eq(referencesRolesTable.status, status));
		} else {
			whereConditions.push(ne(referencesRolesTable.status, 'deleted'));
		}

		if (search) {
			const searchTerm = `%${search}%`;
			whereConditions.push(
				or(
					ilike(referencesRolesTable.nameUz, searchTerm),
					ilike(referencesRolesTable.nameRu, searchTerm),
				),
			);
		}

		const whereClause =
			whereConditions.length > 0 ? and(...whereConditions) : undefined;

		// Get total count excluding deleted records
		const totalCountResult = await db
			.select({ count: count() })
			.from(referencesRolesTable)
			.where(and(whereClause));

		const totalCount = totalCountResult[0].count;

		const {
			currentPage: _currentPage,
			dataPerPage: _dataPerPage,
			offset,
		} = normalizePagination(currentPage, dataPerPage);

		const pagination = calculatePaginationMeta(
			_currentPage,
			_dataPerPage,
			totalCount,
		);

		const roles = await db
			.select()
			.from(referencesRolesTable)
			.where(and(whereClause))
			.orderBy(asc(referencesRolesTable.createdAt))
			.limit(_dataPerPage)
			.offset(offset);

		res.json({
			result: roles,
			pagination,
		});
	} catch (error: unknown) {
		handleError(res, error);
	}
};
