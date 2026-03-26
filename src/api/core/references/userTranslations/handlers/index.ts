import { Request, Response } from 'express';
import { eq, InferSelectModel, ne, or } from 'drizzle-orm';
import { ilike } from 'drizzle-orm';
import { and } from 'drizzle-orm';
import { count } from 'drizzle-orm';
import { asc } from 'drizzle-orm';
import { referencesUserTranslationsTable } from '../../../../../db/schemas';
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
	InferSelectModel<typeof referencesUserTranslationsTable>,
	'status'
>;

interface QueryParams {
	[key: string]: string | undefined;
	currentPage: string;
	dataPerPage: string;
	search?: string;
	status?: IStatuses['status'] | 'all';
	id?: string;
	userId?: string;
	lang?: string;
	namespace?: string;
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
			userId: filterUserId,
			lang,
			namespace,
		} = req.query;

		const userId = getAuthUserId(req);

		if (!userId)
			return res.status(401).json(generateErrorMessage('Unauthorized'));

		if (id) {
			const translation = await db.query.referencesUserTranslationsTable.findFirst({
				where: eq(referencesUserTranslationsTable.id, Number(id)),
			});

			return res.json(translation);
		}

		const whereConditions = [];

		if (userId !== SUPER_ADMIN_ID) {
			whereConditions.push(eq(referencesUserTranslationsTable.createdBy, userId));
		}

		if (status !== 'all') {
			whereConditions.push(eq(referencesUserTranslationsTable.status, status));
		} else {
			whereConditions.push(ne(referencesUserTranslationsTable.status, 'deleted'));
		}

		if (filterUserId) {
			whereConditions.push(eq(referencesUserTranslationsTable.userId, Number(filterUserId)));
		}

		if (lang) {
			whereConditions.push(eq(referencesUserTranslationsTable.lang, lang));
		}

		if (namespace) {
			whereConditions.push(eq(referencesUserTranslationsTable.namespace, namespace));
		}

		if (search) {
			const searchTerm = `%${search}%`;
			whereConditions.push(
				or(
					ilike(referencesUserTranslationsTable.key, searchTerm),
					ilike(referencesUserTranslationsTable.value, searchTerm),
				),
			);
		}

		const whereClause =
			whereConditions.length > 0 ? and(...whereConditions) : undefined;

		// Get total count excluding deleted records
		const totalCountResult = await db
			.select({ count: count() })
			.from(referencesUserTranslationsTable)
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

		const translations = await db
			.select()
			.from(referencesUserTranslationsTable)
			.where(and(whereClause))
			.orderBy(asc(referencesUserTranslationsTable.createdAt))
			.limit(_dataPerPage)
			.offset(offset);

		res.json({
			result: translations,
			pagination,
		});
	} catch (error: unknown) {
		handleError(res, error);
	}
};
