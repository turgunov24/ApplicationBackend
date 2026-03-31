import { Request, Response } from 'express';
import { eq, InferSelectModel, ne } from 'drizzle-orm';
import { and } from 'drizzle-orm';
import { count } from 'drizzle-orm';
import { asc } from 'drizzle-orm';
import { referencesTaskActionsHistoryTable } from '../../../../../db/schemas';
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
	InferSelectModel<typeof referencesTaskActionsHistoryTable>,
	'status'
>;

interface QueryParams {
	[key: string]: string | undefined;
	currentPage: string;
	dataPerPage: string;
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
			status = 'all',
			id,
		} = req.query;

		const userId = getAuthUserId(req);

		if (!userId)
			return res.status(401).json(generateErrorMessage('Unauthorized'));

		if (id) {
			const taskActionsHistory = await db.query.referencesTaskActionsHistoryTable.findFirst({
				where: eq(referencesTaskActionsHistoryTable.id, Number(id)),
			});

			return res.json(taskActionsHistory);
		}

		const whereConditions = [];

		if (userId !== SUPER_ADMIN_ID) {
			whereConditions.push(eq(referencesTaskActionsHistoryTable.createdBy, userId));
		}

		if (status !== 'all') {
			whereConditions.push(eq(referencesTaskActionsHistoryTable.status, status));
		} else {
			whereConditions.push(ne(referencesTaskActionsHistoryTable.status, 'deleted'));
		}

		const whereClause =
			whereConditions.length > 0 ? and(...whereConditions) : undefined;

		const totalCountResult = await db
			.select({ count: count() })
			.from(referencesTaskActionsHistoryTable)
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

		const taskActionsHistory = await db
			.select()
			.from(referencesTaskActionsHistoryTable)
			.where(and(whereClause))
			.orderBy(asc(referencesTaskActionsHistoryTable.createdAt))
			.limit(_dataPerPage)
			.offset(offset);

		res.json({
			result: taskActionsHistory,
			pagination,
		});
	} catch (error: unknown) {
		handleError(res, error);
	}
};
