import { Request, Response } from 'express';
import db from '../../../../db';
import { usersTable } from '../../../../db/schemas';
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

		const whereConditions = [ne(usersTable.status, 'deleted')];

		if (userId !== SUPER_ADMIN_ID) {
			whereConditions.push(eq(usersTable.createdBy, userId));
		}

		const users = await db.query.usersTable.findMany({
			where: and(...whereConditions),
			orderBy: asc(usersTable.createdAt),
			columns: {
				id: true,
				fullName: true,
			},
		});
		res.json(users);
	} catch (error) {
		handleError(res, error);
	}
};
