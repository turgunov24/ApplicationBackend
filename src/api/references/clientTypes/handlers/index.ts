import { Request, Response } from 'express';
import { eq, InferSelectModel, ne, or } from 'drizzle-orm';
import { ilike } from 'drizzle-orm';
import { and } from 'drizzle-orm';
import { count } from 'drizzle-orm';
import { asc } from 'drizzle-orm';
import { referencesClientTypesTable } from '../../../../db/schemas';
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
	InferSelectModel<typeof referencesClientTypesTable>,
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
			const clientType = await db.query.referencesClientTypesTable.findFirst({
				where: eq(referencesClientTypesTable.id, Number(id)),
			});

			return res.json(clientType);
		}

		const whereConditions = [];

		if (userId !== SUPER_ADMIN_ID) {
			whereConditions.push(eq(referencesClientTypesTable.createdBy, userId));
		}

		if (status !== 'all') {
			whereConditions.push(eq(referencesClientTypesTable.status, status));
		} else {
			whereConditions.push(ne(referencesClientTypesTable.status, 'deleted'));
		}

		if (search) {
			const searchTerm = `%${search}%`;
			whereConditions.push(
				or(
					ilike(referencesClientTypesTable.nameUz, searchTerm),
					ilike(referencesClientTypesTable.nameRu, searchTerm),
				),
			);
		}

		const whereClause =
			whereConditions.length > 0 ? and(...whereConditions) : undefined;

		const totalCountResult = await db
			.select({ count: count() })
			.from(referencesClientTypesTable)
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

		const clientTypes = await db
			.select()
			.from(referencesClientTypesTable)
			.where(and(whereClause))
			.orderBy(asc(referencesClientTypesTable.createdAt))
			.limit(_dataPerPage)
			.offset(offset);

		res.json({
			result: clientTypes,
			pagination,
		});
	} catch (error: unknown) {
		handleError(res, error);
	}
};
