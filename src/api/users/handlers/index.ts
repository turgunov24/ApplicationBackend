import { Request, Response } from 'express';
import db from '../../../db';
import { usersTable } from '../../../db/schemas/users';
import { eq, InferSelectModel, or } from 'drizzle-orm';
import { ilike } from 'drizzle-orm';
import { and } from 'drizzle-orm';
import { count } from 'drizzle-orm';
import { asc } from 'drizzle-orm';
import { desc } from 'drizzle-orm';

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
}

export const indexHandler = async (
	req: Request<{}, {}, {}, QueryParams>,
	res: Response
) => {
	try {
		const {
			currentPage = '0',
			dataPerPage = '10',
			search,
			sortBy = 'createdAt',
			sortOrder = 'desc',
			status = 'all',
		} = req.query;

		const _currentPage = Math.max(0, parseInt(currentPage));
		const _dataPerPage = Math.min(100, Math.max(0, parseInt(dataPerPage)));

		const offset = _currentPage * _dataPerPage;

		const whereConditions = [];

		if (status !== 'all') {
			whereConditions.push(eq(usersTable.status, status));
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

		const whereClause =
			whereConditions.length > 0 ? and(...whereConditions) : undefined;

		const totalCountResult = await db
			.select({ count: count() })
			.from(usersTable)
			.where(whereClause);

		const totalCount = totalCountResult[0].count;

		const users = await db
			.select()
			.from(usersTable)
			.where(whereClause)
			.orderBy(
				sortOrder === 'asc'
					? asc(usersTable.createdAt)
					: desc(usersTable.createdAt)
			)
			.limit(_dataPerPage)
			.offset(offset);

		const totalPages = Math.ceil(totalCount / _dataPerPage);
		const hasNextPage = _currentPage < totalPages;
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
		if (error instanceof Error) {
			res.status(500).json({ message: error.message });
		} else {
			res.status(500).json({ message: 'Internal server error' });
		}
	}
};
