import { Request, Response } from 'express';
import {
	eq,
	ne,
	or,
	ilike,
	and,
	count,
	asc,
	InferSelectModel,
} from 'drizzle-orm';
import { referencesLegalFormsTable } from '../../../../../db/schemas/references/legalForms';
import db from '../../../../../db';
import { handleError } from '../../../../../utils/handleError';
import {
	normalizePagination,
	calculatePaginationMeta,
} from '../../../../../utils/pagination';
import { getAuthUserId } from '../../../../../utils/getAuthUserId';
import { SUPER_ADMIN_ID } from '../../../../../helpers/config';

type IStatuses = Pick<
	InferSelectModel<typeof referencesLegalFormsTable>,
	'status'
>;

interface QueryParams {
	[key: string]: string | undefined;
	currentPage: string;
	dataPerPage: string;
	search?: string;
	status?: IStatuses['status'] | 'all';
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
		} = req.query;

		const whereConditions = [];

		if (status !== 'all') {
			whereConditions.push(
				eq(referencesLegalFormsTable.status, status),
			);
		} else {
			whereConditions.push(
				ne(referencesLegalFormsTable.status, 'deleted'),
			);
		}

		if (search) {
			const searchTerm = `%${search}%`;
			whereConditions.push(
				or(ilike(referencesLegalFormsTable.name, searchTerm)),
			);
		}

		const userId = getAuthUserId(req);
		if (userId !== SUPER_ADMIN_ID) {
			whereConditions.push(
				eq(referencesLegalFormsTable.createdBy, userId),
			);
		}

		const whereClause =
			whereConditions.length > 0 ? and(...whereConditions) : undefined;

		const totalCountResult = await db
			.select({ count: count() })
			.from(referencesLegalFormsTable)
			.where(whereClause);

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

		const legalForms = await db
			.select()
			.from(referencesLegalFormsTable)
			.where(whereClause)
			.orderBy(asc(referencesLegalFormsTable.createdAt))
			.limit(_dataPerPage)
			.offset(offset);

		res.json({
			result: legalForms,
			pagination,
		});
	} catch (error: unknown) {
		handleError(res, error);
	}
};
