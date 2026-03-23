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

		// O'sha admin yaratgan tariffs ni filter qilamiz
		whereConditions.push(
			eq(referencesTariffsTable.createdBy, adminId),
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
