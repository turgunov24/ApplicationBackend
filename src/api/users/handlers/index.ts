import { Request, Response } from 'express';
import db from '../../../db';
import { usersTable } from '../../../db/schemas/users';
import { usersRolesTable } from '../../../db/schemas/usersRoles';
import { eq, inArray, InferSelectModel, ne, or } from 'drizzle-orm';
import { ilike } from 'drizzle-orm';
import { and } from 'drizzle-orm';
import { count } from 'drizzle-orm';
import { asc } from 'drizzle-orm';
import { desc } from 'drizzle-orm';
import { handleError } from '../../../utils/handleError';

type IStatuses = Pick<InferSelectModel<typeof usersTable>, 'status'>;

type ISortableFields = Pick<
	InferSelectModel<typeof usersTable>,
	'fullName' | 'username' | 'createdAt'
>;

interface QueryParams {
	currentPage: string;
	dataPerPage: string;
	search?: string;
	sortBy?: keyof ISortableFields;
	sortOrder?: 'asc' | 'desc';
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
			sortBy = 'createdAt',
			sortOrder = 'desc',
			status = 'all',
			id,
			roles,
		} = req.query;

		if (id) {
			const user = await db
				.select()
				.from(usersTable)
				.where(eq(usersTable.id, Number(id)));

			res.json(user[0]);
			return;
		}

		const _currentPage = Math.max(0, parseInt(currentPage));
		const _dataPerPage = Math.min(100, Math.max(0, parseInt(dataPerPage)));

		const offset = _currentPage * _dataPerPage;

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
				inArray(
					usersTable.id,
					db
						.select({ userId: usersRolesTable.userId })
						.from(usersRolesTable)
						.where(inArray(usersRolesTable.roleId, roleIds))
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

		const users = await db
			.select()
			.from(usersTable)
			.where(and(whereClause))
			.orderBy(
				sortOrder === 'asc'
					? asc(usersTable.createdAt)
					: desc(usersTable.createdAt)
			)
			.limit(_dataPerPage)
			.offset(offset);

		const totalPages = Math.ceil(totalCount / _dataPerPage);
		const hasNextPage = _currentPage + 1 < totalPages;
		const hasPrevPage = _currentPage > 0;

		res.json({
			result: users,
			pagination: {
				currentPage: _currentPage,
				dataPerPage: _dataPerPage,
				totalData: totalCount,
				totalPages: totalPages,
				hasNextPage,
				hasPrevPage,
			},
		});
	} catch (error: unknown) {
		handleError(res, error);
	}
};
