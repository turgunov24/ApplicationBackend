import { Request, Response } from 'express';
import db from '../../../../db';
import { principalsTable } from '../../../../db/schemas';
import { handleError } from '../../../../utils/handleError';
import { asc, and, eq, ne } from 'drizzle-orm';
import { getAuthUserId } from '../../../../utils/getAuthUserId';
import { generateErrorMessage } from '../../../../utils/generateErrorMessage';
import { SUPER_ADMIN_ID } from '../../../../helpers/config';

export const listHandler = async (req: Request, res: Response) => {
	try {
		const userId = getAuthUserId(req);

		if (!userId)
			return res.status(401).json(generateErrorMessage('Unauthorized'));

		const whereConditions = [ne(principalsTable.status, 'deleted')];

		if (userId !== SUPER_ADMIN_ID) {
			whereConditions.push(eq(principalsTable.createdBy, userId));
		}

		const principals = await db.query.principalsTable.findMany({
			where: and(...whereConditions),
			orderBy: asc(principalsTable.createdAt),
			columns: {
				id: true,
				fullName: true,
			},
		});
		res.json(principals);
	} catch (error) {
		handleError(res, error);
	}
};
