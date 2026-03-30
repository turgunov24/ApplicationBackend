import { Request, Response } from 'express';
import { eq, InferSelectModel, ne, or } from 'drizzle-orm';
import { ilike } from 'drizzle-orm';
import { and } from 'drizzle-orm';
import { count } from 'drizzle-orm';
import { asc } from 'drizzle-orm';
import { referencesTasksTable } from '../../../../../db/schemas';
import db from '../../../../../db';
import { handleError } from '../../../../../utils/handleError';
import {
	normalizePagination,
	calculatePaginationMeta,
} from '../../../../../utils/pagination';
import { getAuthUserId } from '../../../../../utils/getAuthUserId';
import { generateErrorMessage } from '../../../../../utils/generateErrorMessage';
import { SUPER_ADMIN_ID } from '../../../../../helpers/config';

type IStatuses = Pick<
	InferSelectModel<typeof referencesTasksTable>,
	'status'
>;

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
			const task = await db.query.referencesTasksTable.findFirst({
				where: eq(referencesTasksTable.id, Number(id)),
			});

			return res.json(task);
		}

		const whereConditions = [];

		if (userId !== SUPER_ADMIN_ID) {
			whereConditions.push(eq(referencesTasksTable.createdBy, userId));
		}

		if (status !== 'all') {
			whereConditions.push(eq(referencesTasksTable.status, status));
		} else {
			whereConditions.push(ne(referencesTasksTable.status, 'deleted'));
		}

		if (search) {
			const searchTerm = `%${search}%`;
			whereConditions.push(
				or(
					ilike(referencesTasksTable.translationKey, searchTerm),
					ilike(referencesTasksTable.description, searchTerm),
				),
			);
		}

		const whereClause =
			whereConditions.length > 0 ? and(...whereConditions) : undefined;

		const totalCountResult = await db
			.select({ count: count() })
			.from(referencesTasksTable)
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

		const tasks = await db
			.select()
			.from(referencesTasksTable)
			.where(and(whereClause))
			.orderBy(asc(referencesTasksTable.createdAt))
			.limit(_dataPerPage)
			.offset(offset);

		res.json({
			result: tasks,
			pagination,
		});
	} catch (error: unknown) {
		handleError(res, error);
	}
};
