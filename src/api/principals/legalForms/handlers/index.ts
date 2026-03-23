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
import { principalsTable } from '../../../../db/schemas';
import { referencesLegalFormsTable } from '../../../../db/schemas/references/legalForms';
import db from '../../../../db';
import { handleError } from '../../../../utils/handleError';
import {
	normalizePagination,
	calculatePaginationMeta,
} from '../../../../utils/pagination';
import { generateErrorMessage } from '../../../../utils/generateErrorMessage';

type IStatuses = Pick<
	InferSelectModel<typeof referencesLegalFormsTable>,
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

		// Principalni DB dan topib, createdBy (admin ID) ni olamiz
		const principalRecord = await db.query.principalsTable.findFirst({
			where: eq(principalsTable.id, principal.id),
			columns: {
				createdBy: true,
			},
		});

		if (!principalRecord)
			return res
				.status(404)
				.json(generateErrorMessage('Principal not found'));

		const adminId = principalRecord.createdBy;

		const whereConditions = [];

		// O'sha admin yaratgan legalForms ni filter qilamiz
		whereConditions.push(
			eq(referencesLegalFormsTable.createdBy, adminId),
		);

		if (status !== 'all') {
			whereConditions.push(
				eq(referencesLegalFormsTable.status, status),
			);
		} else {
			whereConditions.push(
				ne(referencesLegalFormsTable.status, 'deleted'),
			);
		}

		if (search) {
			const searchTerm = `%${search}%`;
			whereConditions.push(
				ilike(referencesLegalFormsTable.name, searchTerm),
			);
		}

		const whereClause =
			whereConditions.length > 0 ? and(...whereConditions) : undefined;

		const totalCountResult = await db
			.select({ count: count() })
			.from(referencesLegalFormsTable)
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

		const legalForms = await db
			.select()
			.from(referencesLegalFormsTable)
			.where(whereClause)
			.orderBy(asc(referencesLegalFormsTable.createdAt))
			.limit(_dataPerPage)
			.offset(offset);

		res.json({
			result: legalForms,
			pagination,
		});
	} catch (error: unknown) {
		handleError(res, error);
	}
};
