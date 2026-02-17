import { Request, Response } from 'express';
import db from '../../../../db';
import { principalsTable } from '../../../../db/schemas/principals';
import { eq, ilike, and, count, asc, ne, or } from 'drizzle-orm';
import { handleError } from '../../../../utils/handleError';
import {
	normalizePagination,
	calculatePaginationMeta,
} from '../../../../utils/pagination';
import { omit } from 'es-toolkit/compat';
import { getAuthUserId } from '../../../../utils/getAuthUserId';
import { generateErrorMessage } from '../../../../utils/generateErrorMessage';
import { SUPER_ADMIN_ID } from '../../../../helpers/config';
import { InferSelectModel } from 'drizzle-orm';

type IStatuses = Pick<InferSelectModel<typeof principalsTable>, 'status'>;

interface QueryParams {
	[key: string]: string | string[] | undefined;
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

		if (!userId) {
			return res.status(401).json(generateErrorMessage('Unauthorized'));
		}

		if (id) {
			const principal = await db.query.principalsTable.findFirst({
				where: eq(principalsTable.id, Number(id)),
			});

			if (principal) {
				return res.json({
					...omit(principal, ['token', 'updatedAt', 'password']),
				});
			}
		}

		const whereConditions = [];

		if (userId !== SUPER_ADMIN_ID) {
			whereConditions.push(eq(principalsTable.createdBy, userId));
		}

		if (status !== 'all') {
			whereConditions.push(eq(principalsTable.status, status));
		} else {
			whereConditions.push(ne(principalsTable.status, 'deleted'));
		}

		if (search) {
			const searchTerm = `%${search}%`;
			whereConditions.push(
				or(
					ilike(principalsTable.fullName, searchTerm),
					ilike(principalsTable.username, searchTerm),
				),
			);
		}

		const whereClause =
			whereConditions.length > 0 ? and(...whereConditions) : undefined;

		const totalCountResult = await db
			.select({ count: count() })
			.from(principalsTable)
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

		const principals = await db.query.principalsTable.findMany({
			where: and(whereClause),
			orderBy: asc(principalsTable.createdAt),
			limit: _dataPerPage,
			offset: offset,
		});

		res.json({
			result: principals.map((principal) =>
				omit(principal, ['token', 'updatedAt', 'password']),
			),
			pagination,
		});
	} catch (error: unknown) {
		handleError(res, error);
	}
};
