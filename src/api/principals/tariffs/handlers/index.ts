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
import { principalCustomersTable } from '../../../../db/schemas';
import { referencesTariffsTable } from '../../../../db/schemas/references/tariffs';
import db from '../../../../db';
import { handleError } from '../../../../utils/handleError';
import {
	normalizePagination,
	calculatePaginationMeta,
} from '../../../../utils/pagination';
import { generateErrorMessage } from '../../../../utils/generateErrorMessage';

type IStatuses = Pick<
	InferSelectModel<typeof referencesTariffsTable>,
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

		const principal = req.principal;

		if (!principal)
			return res.status(401).json(generateErrorMessage('Unauthorized'));

		// Get principal_customers entries for this principal
		const principalCustomers = await db
			.select({ counterpartyId: principalCustomersTable.counterpartyId })
			.from(principalCustomersTable)
			.where(
				and(
					eq(principalCustomersTable.principalId, principal.id),
					ne(principalCustomersTable.status, 'deleted'),
				),
			);

		const counterpartyIds = principalCustomers.map(
			(pc) => pc.counterpartyId,
		);

		if (counterpartyIds.length === 0) {
			return res.json({
				result: [],
				pagination: {
					currentPage: 0,
					dataPerPage: 5,
					totalData: 0,
					totalPages: 0,
					hasNextPage: false,
					hasPrevPage: false,
				},
			});
		}

		const whereConditions = [];

		// Filter by counterparty IDs belonging to this principal
		whereConditions.push(
			or(
				...counterpartyIds.map((id) =>
					eq(referencesTariffsTable.id, id),
				),
			),
		);

		if (status !== 'all') {
			whereConditions.push(
				eq(referencesTariffsTable.status, status),
			);
		} else {
			whereConditions.push(
				ne(referencesTariffsTable.status, 'deleted'),
			);
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
