import { Request, Response } from 'express';
import db from '../../../../../db';
import { referencesCounterpartiesTable } from '../../../../../db/schemas';
import { handleError } from '../../../../../utils/handleError';
import { and, asc, eq, ne } from 'drizzle-orm';
import { getAuthUserId } from '../../../../../utils/getAuthUserId';
import { generateErrorMessage } from '../../../../../utils/generateErrorMessage';
import { SUPER_ADMIN_ID } from '../../../../../helpers/config';

export const listHandler = async (req: Request, res: Response) => {
	try {
		const userId = getAuthUserId(req);

		if (!userId)
			return res.status(401).json(generateErrorMessage('Unauthorized'));

		const whereConditions = [
			ne(referencesCounterpartiesTable.status, 'deleted'),
		];

		if (userId !== SUPER_ADMIN_ID) {
			whereConditions.push(
				eq(referencesCounterpartiesTable.createdBy, userId),
			);
		}

		const counterparties =
			await db.query.referencesCounterpartiesTable.findMany({
				where: and(...whereConditions),
				orderBy: asc(referencesCounterpartiesTable.createdAt),
				columns: {
					id: true,
					name: true,
				},
			});
		res.json(counterparties);
	} catch (error) {
		handleError(res, error);
	}
};
