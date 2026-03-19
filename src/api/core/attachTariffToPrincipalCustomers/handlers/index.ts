import { Request, Response } from 'express';
import { eq, InferSelectModel, ne, or } from 'drizzle-orm';
import { ilike } from 'drizzle-orm';
import { and } from 'drizzle-orm';
import { count } from 'drizzle-orm';
import { asc } from 'drizzle-orm';
import { referencesAttachTariffToPrincipalCustomersTable } from '../../../../db/schemas/references/attachTariffToPrincipalCustomers';
import db from '../../../../db';
import { handleError } from '../../../../utils/handleError';
import {
	normalizePagination,
	calculatePaginationMeta,
} from '../../../../utils/pagination';
import { getAuthUserId } from '../../../../utils/getAuthUserId';
import { generateErrorMessage } from '../../../../utils/generateErrorMessage';
import { SUPER_ADMIN_ID } from '../../../../helpers/config';

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
			const record = await db.query.referencesAttachTariffToPrincipalCustomersTable.findFirst({
				where: eq(referencesAttachTariffToPrincipalCustomersTable.id, Number(id)),
				with: {
					tariff: true,
					principalCustomer: true,
				},
			});

			return res.json(record);
		}

		const whereConditions = [];

		if (userId !== SUPER_ADMIN_ID) {
			whereConditions.push(eq(referencesAttachTariffToPrincipalCustomersTable.createdBy, userId));
		}

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

		const records = await db.query.referencesAttachTariffToPrincipalCustomersTable.findMany({
			where: whereClause,
			orderBy: asc(referencesAttachTariffToPrincipalCustomersTable.createdAt),
			limit: _dataPerPage,
			offset,
			with: {
				tariff: true,
				principalCustomer: true,
			},
		});

		res.json({
			result: records,
			pagination,
		});
	} catch (error: unknown) {
		handleError(res, error);
	}
};
