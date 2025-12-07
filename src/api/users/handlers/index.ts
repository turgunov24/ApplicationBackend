import { Request, Response } from 'express';
import db from '../../../db';
import { usersTable } from '../../../db/schemas/users';
import { usersRolesTable } from '../../../db/schemas/usersRoles';
import { eq, exists, inArray, InferSelectModel, ne, or } from 'drizzle-orm';
import { ilike } from 'drizzle-orm';
import { and } from 'drizzle-orm';
import { count } from 'drizzle-orm';
import { asc } from 'drizzle-orm';
import { handleError } from '../../../utils/handleError';
import {
	normalizePagination,
	calculatePaginationMeta,
} from '../../../utils/pagination';
import { omit } from 'es-toolkit/compat';

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get users list or single user
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: User ID to get single user
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
 *         description: Search term for fullName or username
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, deleted, all]
 *           default: all
 *         description: Filter by status
 *       - in: query
 *         name: roles
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Filter by role IDs
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
 *                       fullName:
 *                         type: string
 *                       username:
 *                         type: string
 *                       email:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       countryId:
 *                         type: integer
 *                       regionId:
 *                         type: integer
 *                       districtId:
 *                         type: integer
 *                       status:
 *                         type: string
 *                         enum: [active, deleted]
 *                       avatarPath:
 *                         type: string
 *                         nullable: true
 *                       roles:
 *                         type: array
 *                         items:
 *                           type: integer
 *                         description: Array of role IDs
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

type IStatuses = Pick<InferSelectModel<typeof usersTable>, 'status'>;

interface QueryParams {
	currentPage: string;
	dataPerPage: string;
	search?: string;
	status?: IStatuses['status'] | 'all';
	id?: string;
	roles: string[];
}

export const indexHandler = async (
	req: Request<{}, {}, {}, QueryParams>,
	res: Response
) => {
	try {
		const {
			currentPage = '0',
			dataPerPage = '5',
			search,
			status = 'all',
			id,
			roles,
		} = req.query;

		if (id) {
			const user = await db.query.usersTable.findFirst({
				where: eq(usersTable.id, Number(id)),
				with: {
					userRoles: {
						columns: {
							roleId: true,
						},
					},
				},
			});

			if (user) {
				return res.json({
					...omit(user, [
						'token',
						'createdAt',
						'updatedAt',
						'password',
						'userRoles',
					]),
					roles: user.userRoles.map((role) => role.roleId),
				});
			}
		}

		const whereConditions = [];

		if (status !== 'all') {
			whereConditions.push(eq(usersTable.status, status));
		} else {
			whereConditions.push(ne(usersTable.status, 'deleted'));
		}

		if (search) {
			const searchTerm = `%${search}%`;
			whereConditions.push(
				or(
					ilike(usersTable.fullName, searchTerm),
					ilike(usersTable.username, searchTerm)
				)
			);
		}

		if (roles && roles.length > 0) {
			const roleIds = roles.map((role) => Number(role));
			whereConditions.push(
				exists(
					db
						.select()
						.from(usersRolesTable)
						.where(
							and(
								eq(usersRolesTable.userId, usersTable.id),
								inArray(usersRolesTable.roleId, roleIds)
							)
						)
				)
			);
		}

		const whereClause =
			whereConditions.length > 0 ? and(...whereConditions) : undefined;

		const totalCountResult = await db
			.select({ count: count() })
			.from(usersTable)
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
			totalCount
		);

		const users = await db.query.usersTable.findMany({
			where: and(whereClause),
			orderBy: asc(usersTable.createdAt),
			limit: _dataPerPage,
			offset: offset,
			with: {
				userRoles: {
					columns: {
						roleId: true,
					},
				},
			},
		});

		res.json({
			result: users.map((user) => ({
				...omit(user, [
					'token',
					'createdAt',
					'updatedAt',
					'password',
					'userRoles',
				]),
				roles: user.userRoles.map((role) => role.roleId),
			})),
			pagination,
		});
	} catch (error: unknown) {
		handleError(res, error);
	}
};
