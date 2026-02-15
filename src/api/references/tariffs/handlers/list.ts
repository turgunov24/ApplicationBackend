import { Request, Response } from 'express';
import db from '../../../../db';
import { referencesTariffsTable } from '../../../../db/schemas';
import { handleError } from '../../../../utils/handleError';
import { and, asc, eq, ne } from 'drizzle-orm';
import { getAuthUserId } from '../../../../utils/getAuthUserId';
import { generateErrorMessage } from '../../../../utils/generateErrorMessage';
import { SUPER_ADMIN_ID } from '../../../../helpers/config';

export const listHandler = async (req: Request, res: Response) => {
	try {
		const userId = getAuthUserId(req);

		if (!userId)
			return res.status(401).json(generateErrorMessage('Unauthorized'));

		const whereConditions = [ne(referencesTariffsTable.status, 'deleted')];

		if (userId !== SUPER_ADMIN_ID) {
			whereConditions.push(eq(referencesTariffsTable.createdBy, userId));
		}

		const tariffs = await db.query.referencesTariffsTable.findMany({
			where: and(...whereConditions),
			orderBy: asc(referencesTariffsTable.createdAt),
			columns: {
				id: true,
				nameUz: true,
				nameRu: true,
				monthlyPrice: true,
			},
			with: {
				currency: {
					columns: {
						id: true,
						nameUz: true,
					},
				},
			},
		});
		res.json(tariffs);
	} catch (error) {
		handleError(res, error);
	}
};
