import { Request, Response } from 'express';
import { eq, InferSelectModel, ne, or } from 'drizzle-orm';
import { ilike } from 'drizzle-orm';
import { and } from 'drizzle-orm';
import { count } from 'drizzle-orm';
import { asc } from 'drizzle-orm';
import { principalCustomersTable } from '../../../../db/schemas/principalCustomers';
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
	InferSelectModel<typeof principalCustomersTable>,
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
			const principalCustomer =
				await db.query.principalCustomersTable.findFirst({
					where: eq(principalCustomersTable.id, Number(id)),
				});

			return res.json(principalCustomer);
		}

		const whereConditions = [];

		if (userId !== SUPER_ADMIN_ID) {
			whereConditions.push(eq(principalCustomersTable.createdBy, userId));
		}

		if (status !== 'all') {
			whereConditions.push(eq(principalCustomersTable.status, status));
		} else {
			whereConditions.push(ne(principalCustomersTable.status, 'deleted'));
		}

		if (search) {
			const searchTerm = `%${search}%`;
			whereConditions.push(ilike(principalCustomersTable.name, searchTerm));
		}

		const whereClause =
			whereConditions.length > 0 ? and(...whereConditions) : undefined;

		const totalCountResult = await db
			.select({ count: count() })
			.from(principalCustomersTable)
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

		const principalCustomers = await db
			.select()
			.from(principalCustomersTable)
			.where(and(whereClause))
			.orderBy(asc(principalCustomersTable.createdAt))
			.limit(_dataPerPage)
			.offset(offset);

		res.json({
			result: principalCustomers,
			pagination,
		});
	} catch (error: unknown) {
		handleError(res, error);
	}
};
