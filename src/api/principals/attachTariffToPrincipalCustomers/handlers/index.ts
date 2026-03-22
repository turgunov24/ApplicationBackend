import { Request, Response } from 'express';
import {
	eq,
	ne,
	and,
	count,
	asc,
	inArray,
	InferSelectModel,
} from 'drizzle-orm';
import { principalCustomersTable } from '../../../../db/schemas';
import { referencesAttachTariffToPrincipalCustomersTable } from '../../../../db/schemas/references/attachTariffToPrincipalCustomers';
import { referencesCounterpartiesTable } from '../../../../db/schemas/references/counterparties';
import db from '../../../../db';
import { handleError } from '../../../../utils/handleError';
import {
	normalizePagination,
	calculatePaginationMeta,
} from '../../../../utils/pagination';
import { generateErrorMessage } from '../../../../utils/generateErrorMessage';

type IStatuses = Pick<
	InferSelectModel<typeof referencesAttachTariffToPrincipalCustomersTable>,
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
			.select({ id: principalCustomersTable.id })
			.from(principalCustomersTable)
			.where(
				and(
					eq(principalCustomersTable.principalId, principal.id),
					ne(principalCustomersTable.status, 'deleted'),
				),
			);

		const principalCustomerIds = principalCustomers.map((pc) => pc.id);

		if (principalCustomerIds.length === 0) {
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

		// Filter by principal customer IDs belonging to this principal
		whereConditions.push(
			inArray(referencesAttachTariffToPrincipalCustomersTable.principalCustomerId, principalCustomerIds),
		);

		if (status !== 'all') {
			whereConditions.push(eq(referencesAttachTariffToPrincipalCustomersTable.status, status));
		} else {
			whereConditions.push(ne(referencesAttachTariffToPrincipalCustomersTable.status, 'deleted'));
		}

		const whereClause =
			whereConditions.length > 0 ? and(...whereConditions) : undefined;

		const totalCountResult = await db
			.select({ count: count() })
			.from(referencesAttachTariffToPrincipalCustomersTable)
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

		const records =
			await db.query.referencesAttachTariffToPrincipalCustomersTable.findMany(
				{
					where: whereClause,
					orderBy: asc(
						referencesAttachTariffToPrincipalCustomersTable.createdAt,
					),
					limit: _dataPerPage,
					offset,
					with: {
						tariff: {
							columns: {
								nameUz: true,
								nameRu: true,
								monthlyPrice: true,
							},
							with: {
								currency: {
									columns: {
										nameUz: true,
										nameRu: true,
									},
								},
							},
						},
						principalCustomer: true,
					},
				},
			);

		// counterparty ni alohida olamiz (PostgreSQL 63-char identifier limit tufayli nested with ishlamaydi)
		const counterpartyIds = [
			...new Set(
				records
					.map((r) => r.principalCustomer?.counterpartyId)
					.filter(Boolean),
			),
		] as number[];

		const counterparties =
			counterpartyIds.length > 0
				? await db
						.select({
							id: referencesCounterpartiesTable.id,
							name: referencesCounterpartiesTable.name,
						})
						.from(referencesCounterpartiesTable)
						.where(
							inArray(
								referencesCounterpartiesTable.id,
								counterpartyIds,
							),
						)
				: [];

		const counterpartyMap = new Map(
			counterparties.map((c) => [c.id, c]),
		);

		const result = records.map((r) => ({
			...r,
			principalCustomer: r.principalCustomer
				? {
						...r.principalCustomer,
						counterparty:
							counterpartyMap.get(
								r.principalCustomer.counterpartyId,
							) || null,
					}
				: r.principalCustomer,
		}));

		res.json({
			result,
			pagination,
		});
	} catch (error: unknown) {
		handleError(res, error);
	}
};
