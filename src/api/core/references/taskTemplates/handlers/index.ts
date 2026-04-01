import { Request, Response } from 'express';
import { eq, InferSelectModel, ne, or } from 'drizzle-orm';
import { ilike } from 'drizzle-orm';
import { and } from 'drizzle-orm';
import { count } from 'drizzle-orm';
import { asc } from 'drizzle-orm';
import { referencesTaskTemplatesTable } from '../../../../../db/schemas';
import db from '../../../../../db';
import { handleError } from '../../../../../utils/handleError';
import {
	normalizePagination,
	calculatePaginationMeta,
} from '../../../../../utils/pagination';
import { getAuthUserId } from '../../../../../utils/getAuthUserId';
import { generateErrorMessage } from '../../../../../utils/generateErrorMessage';
import { SUPER_ADMIN_ID } from '../../../../../helpers/config';

type IStatuses = Pick<
	InferSelectModel<typeof referencesTaskTemplatesTable>,
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
			const taskTemplate = await db.query.referencesTaskTemplatesTable.findFirst({
				where: eq(referencesTaskTemplatesTable.id, Number(id)),
			});

			return res.json(taskTemplate);
		}

		const whereConditions = [];

		if (userId !== SUPER_ADMIN_ID) {
			whereConditions.push(eq(referencesTaskTemplatesTable.createdBy, userId));
		}

		if (status !== 'all') {
			whereConditions.push(eq(referencesTaskTemplatesTable.status, status));
		} else {
			whereConditions.push(ne(referencesTaskTemplatesTable.status, 'deleted'));
		}

		if (search) {
			const searchTerm = `%${search}%`;
			whereConditions.push(
				or(
					ilike(referencesTaskTemplatesTable.translationKey, searchTerm),
					ilike(referencesTaskTemplatesTable.description, searchTerm),
				),
			);
		}

		const whereClause =
			whereConditions.length > 0 ? and(...whereConditions) : undefined;

		const totalCountResult = await db
			.select({ count: count() })
			.from(referencesTaskTemplatesTable)
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

		const taskTemplates = await db
			.select()
			.from(referencesTaskTemplatesTable)
			.where(and(whereClause))
			.orderBy(asc(referencesTaskTemplatesTable.createdAt))
			.limit(_dataPerPage)
			.offset(offset);

		res.json({
			result: taskTemplates,
			pagination,
		});
	} catch (error: unknown) {
		handleError(res, error);
	}
};
