import { Request, Response } from 'express';
import db from '../../../db';
import { usersTable } from '../../../db/schemas/users';
import { InferSelectModel, or } from 'drizzle-orm';
import { ilike } from 'drizzle-orm';
import { and } from 'drizzle-orm';
import { count } from 'drizzle-orm';
import { asc } from 'drizzle-orm';
import { desc } from 'drizzle-orm';

type ISortableFields = keyof Pick<
	InferSelectModel<typeof usersTable>,
	'name' | 'username' | 'createdAt'
>;

interface QueryParams {
	currentPage: string;
	dataPerPage: string;
	search?: string;
	sortBy?: ISortableFields;
	sortOrder?: 'asc' | 'desc';
}

export const indexHandler = async (
	req: Request<{}, {}, {}, QueryParams>,
	res: Response
) => {
	try {
		const {
			currentPage = '1',
			dataPerPage = '10',
			search,
			sortBy = 'createdAt',
			sortOrder = 'desc',
		} = req.query;

		const _currentPage = Math.max(1, parseInt(currentPage));
		const _dataPerPage = Math.min(100, Math.max(1, parseInt(dataPerPage)));

		const offset = (_currentPage - 1) * _dataPerPage;

		const whereConditions = [];

		if (search) {
			const searchTerm = `%${search}%`;
			whereConditions.push(
				or(
					ilike(usersTable.name, searchTerm),
					ilike(usersTable.username, searchTerm)
				)
			);
		}

		const whereClause =
			whereConditions.length > 0 ? and(...whereConditions) : undefined;

		const orderBy =
			sortOrder === 'asc' ? asc(usersTable[sortBy]) : desc(usersTable[sortBy]);

		const totalCountResult = await db
			.select({ count: count() })
			.from(usersTable)
			.where(whereClause);

		const totalCount = totalCountResult[0].count;

		const users = await db
			.select()
			.from(usersTable)
			.where(whereClause)
			.orderBy(orderBy)
			.limit(_dataPerPage)
			.offset(offset);

		const totalPages = Math.ceil(totalCount / _dataPerPage);
		const hasNextPage = _currentPage < totalPages;
		const hasPrevPage = _currentPage > 1;

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
