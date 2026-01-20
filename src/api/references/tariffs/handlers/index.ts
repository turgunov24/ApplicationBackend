import { Request, Response } from 'express';
import { eq, InferSelectModel, ne, or } from 'drizzle-orm';
import { ilike } from 'drizzle-orm';
import { and } from 'drizzle-orm';
import { count } from 'drizzle-orm';
import { asc } from 'drizzle-orm';
import {
	referencesTariffsTable,
	referencesCurrenciesTable,
} from '../../../../db/schemas';
import db from '../../../../db';
import { handleError } from '../../../../utils/handleError';
import {
	normalizePagination,
	calculatePaginationMeta,
} from '../../../../utils/pagination';

type IStatuses = Pick<
	InferSelectModel<typeof referencesTariffsTable>,
	'status'
>;

interface QueryParams {
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

		if (id) {
			const tariff = await db.query.referencesTariffsTable.findFirst({
				where: eq(referencesTariffsTable.id, Number(id)),
				with: {
					currency: true,
				},
			});

			return res.json(tariff);
		}

		const whereConditions = [];

		if (status !== 'all') {
			whereConditions.push(eq(referencesTariffsTable.status, status));
		} else {
			whereConditions.push(ne(referencesTariffsTable.status, 'deleted'));
		}

		if (search) {
			const searchTerm = `%${search}%`;
			whereConditions.push(
				or(
					ilike(referencesTariffsTable.nameUz, searchTerm),
					ilike(referencesTariffsTable.nameRu, searchTerm),
				),
			);
		}

		const whereClause =
			whereConditions.length > 0 ? and(...whereConditions) : undefined;

		const totalCountResult = await db
			.select({ count: count() })
			.from(referencesTariffsTable)
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

		const tariffs = await db.query.referencesTariffsTable.findMany({
			where: whereClause,
			orderBy: asc(referencesTariffsTable.createdAt),
			limit: _dataPerPage,
			offset,
			with: {
				currency: true,
			},
		});

		const result = tariffs.map((tariff) => ({
			...tariff,
			currencyName: tariff.currency?.nameUz || '',
		}));

		res.json({
			result,
			pagination,
		});
	} catch (error: unknown) {
		handleError(res, error);
	}
};
