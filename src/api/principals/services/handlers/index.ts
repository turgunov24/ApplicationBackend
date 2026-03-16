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
import { referencesServicesTable } from '../../../../db/schemas/references/services';
import db from '../../../../db';
import { handleError } from '../../../../utils/handleError';
import {
	normalizePagination,
	calculatePaginationMeta,
} from '../../../../utils/pagination';
import { generateErrorMessage } from '../../../../utils/generateErrorMessage';

type IStatuses = Pick<
	InferSelectModel<typeof referencesServicesTable>,
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
			.select({ legalFormId: principalCustomersTable.legalFormId })
			.from(principalCustomersTable)
			.where(
				and(
					eq(principalCustomersTable.principalId, principal.id),
					ne(principalCustomersTable.status, 'deleted'),
				),
			);

		const legalFormIds = principalCustomers.map((pc) => pc.legalFormId);

		if (legalFormIds.length === 0) {
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

		// Filter by legalForm IDs belonging to this principal
		whereConditions.push(
			or(
				...legalFormIds.map((id) =>
					eq(referencesServicesTable.id, id),
				),
			),
		);

		if (status !== 'all') {
			whereConditions.push(
				eq(referencesServicesTable.status, status),
			);
		} else {
			whereConditions.push(
				ne(referencesServicesTable.status, 'deleted'),
			);
		}

		if (search) {
			const searchTerm = `%${search}%`;
			whereConditions.push(
				ilike(referencesServicesTable.name, searchTerm),
			);
		}

		const whereClause =
			whereConditions.length > 0 ? and(...whereConditions) : undefined;

		const totalCountResult = await db
			.select({ count: count() })
			.from(referencesServicesTable)
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

		const services = await db
			.select()
			.from(referencesServicesTable)
			.where(whereClause)
			.orderBy(asc(referencesServicesTable.createdAt))
			.limit(_dataPerPage)
			.offset(offset);

		res.json({
			result: services,
			pagination,
		});
	} catch (error: unknown) {
		handleError(res, error);
	}
};
