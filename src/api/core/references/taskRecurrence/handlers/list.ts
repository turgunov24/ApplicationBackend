import { Request, Response } from 'express';
import db from '../../../../../db';
import { referencesTaskRecurrenceTable } from '../../../../../db/schemas';
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

		const whereConditions = [ne(referencesTaskRecurrenceTable.status, 'deleted')];

		if (userId !== SUPER_ADMIN_ID) {
			whereConditions.push(eq(referencesTaskRecurrenceTable.createdBy, userId));
		}

		const taskRecurrences = await db.query.referencesTaskRecurrenceTable.findMany({
			where: and(...whereConditions),
			orderBy: asc(referencesTaskRecurrenceTable.createdAt),
			columns: {
				id: true,
				translationKey: true,
				token: true,
			},
		});
		res.json(taskRecurrences);
	} catch (error) {
		handleError(res, error);
	}
};
