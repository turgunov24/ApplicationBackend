import { Request, Response } from 'express';
import db from '../../../../../db';
import { referencesTasksCommentsTable } from '../../../../../db/schemas';
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

		const whereConditions = [ne(referencesTasksCommentsTable.status, 'deleted')];

		if (userId !== SUPER_ADMIN_ID) {
			whereConditions.push(eq(referencesTasksCommentsTable.createdBy, userId));
		}

		const tasksComments = await db.query.referencesTasksCommentsTable.findMany({
			where: and(...whereConditions),
			orderBy: asc(referencesTasksCommentsTable.createdAt),
			columns: {
				id: true,
				taskId: true,
				text: true,
			},
		});
		res.json(tasksComments);
	} catch (error) {
		handleError(res, error);
	}
};
