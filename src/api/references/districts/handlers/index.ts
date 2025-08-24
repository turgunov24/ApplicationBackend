import { Request, Response } from 'express';
import { eq, InferSelectModel, ne, or } from 'drizzle-orm';
import { ilike } from 'drizzle-orm';
import { and } from 'drizzle-orm';
import { count } from 'drizzle-orm';
import { asc } from 'drizzle-orm';
import { desc } from 'drizzle-orm';
import { referencesDistrictsTable } from '../../../../db/schemas/references/districts';
import db from '../../../../db';
import { handleError } from '../../../../utils/handleError';

type IStatuses = Pick<
	InferSelectModel<typeof referencesDistrictsTable>,
	'status'
>;

type ISortableFields = Pick<
	InferSelectModel<typeof referencesDistrictsTable>,
	'nameUz' | 'nameRu' | 'createdAt'
>;

interface QueryParams {
	currentPage: string;
	dataPerPage: string;
	search?: string;
	sortBy?: keyof ISortableFields;
	sortOrder?: 'asc' | 'desc';
	status?: IStatuses['status'];
	id?: string;
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
			// sortBy = 'createdAt',
			sortOrder = 'desc',
			// status = 'active',
			id,
		} = req.query;

		if (id) {
			const user = await db
				.select()
				.from(referencesDistrictsTable)
				.where(eq(referencesDistrictsTable.id, Number(id)));

			res.json(user[0]);
			return;
		}

		const _currentPage = Math.max(0, parseInt(currentPage));
		const _dataPerPage = Math.min(100, Math.max(0, parseInt(dataPerPage)));

		const offset = _currentPage * _dataPerPage;

		const whereConditions = [];

		if (search) {
			const searchTerm = `%${search}%`;
			whereConditions.push(
				or(
					ilike(referencesDistrictsTable.nameUz, searchTerm),
					ilike(referencesDistrictsTable.nameRu, searchTerm)
				)
			);
		}

		const whereClause =
			whereConditions.length > 0 ? and(...whereConditions) : undefined;

		const totalCountResult = await db
			.select({ count: count() })
			.from(referencesDistrictsTable)
			.where(and(whereClause, ne(referencesDistrictsTable.status, 'deleted')));

		const totalCount = totalCountResult[0].count;

		const users = await db
			.select()
				.from(referencesDistrictsTable)
			.where(and(whereClause, ne(referencesDistrictsTable.status, 'deleted')))
			.orderBy(
				sortOrder === 'asc'
					? asc(referencesDistrictsTable.createdAt)
					: desc(referencesDistrictsTable.createdAt)
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
