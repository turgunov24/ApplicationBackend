import { Request, Response } from 'express';
import db from '../../../../db';
import { referencesClientTypesTable } from '../../../../db/schemas';
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

		const whereConditions = [ne(referencesClientTypesTable.status, 'deleted')];

		if (userId !== SUPER_ADMIN_ID) {
			whereConditions.push(eq(referencesClientTypesTable.createdBy, userId));
		}

		const clientTypes = await db.query.referencesClientTypesTable.findMany({
			where: and(...whereConditions),
			orderBy: asc(referencesClientTypesTable.createdAt),
			columns: {
				id: true,
				nameUz: true,
				nameRu: true,
			},
		});
		res.json(clientTypes);
	} catch (error) {
		handleError(res, error);
	}
};
