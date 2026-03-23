import { Request, Response } from 'express';
import { eq, InferSelectModel, ne, or } from 'drizzle-orm';
import { ilike } from 'drizzle-orm';
import { and } from 'drizzle-orm';
import { count } from 'drizzle-orm';
import { asc } from 'drizzle-orm';
import { referencesCounterpartiesTable } from '../../../../db/schemas';
import db from '../../../../db';
import { handleError } from '../../../../utils/handleError';
import {
	normalizePagination,
	calculatePaginationMeta,
} from '../../../../utils/pagination';
import { generateErrorMessage } from '../../../../utils/generateErrorMessage';

type IStatuses = Pick<
	InferSelectModel<typeof referencesCounterpartiesTable>,
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

		const principal = req.principal;

		if (!principal)
			return res.status(401).json(generateErrorMessage('Unauthorized'));

		if (id) {
			const counterparty =
				await db.query.referencesCounterpartiesTable.findFirst({
					where: eq(referencesCounterpartiesTable.id, Number(id)),
				});

			return res.json(counterparty);
		}

		const whereConditions = [];

		// Bevosita principalId orqali filter
		whereConditions.push(
			eq(referencesCounterpartiesTable.principalId, principal.id),
		);

		if (status !== 'all') {
			whereConditions.push(
				eq(referencesCounterpartiesTable.status, status),
			);
		} else {
			whereConditions.push(
				ne(referencesCounterpartiesTable.status, 'deleted'),
			);
		}

		if (search) {
			const searchTerm = `%${search}%`;
			whereConditions.push(
				ilike(referencesCounterpartiesTable.name, searchTerm),
			);
		}

		const whereClause =
			whereConditions.length > 0 ? and(...whereConditions) : undefined;

		const totalCountResult = await db
			.select({ count: count() })
			.from(referencesCounterpartiesTable)
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

		const counterparties = await db
			.select()
			.from(referencesCounterpartiesTable)
			.where(whereClause)
			.orderBy(asc(referencesCounterpartiesTable.createdAt))
			.limit(_dataPerPage)
			.offset(offset);

		res.json({
			result: counterparties,
			pagination,
		});
	} catch (error: unknown) {
		handleError(res, error);
	}
};
