import { Request, Response } from 'express';
import db from '../../../../../db';
import { referencesTaskTemplatesTable } from '../../../../../db/schemas';
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

		const whereConditions = [ne(referencesTaskTemplatesTable.status, 'deleted')];

		if (userId !== SUPER_ADMIN_ID) {
			whereConditions.push(eq(referencesTaskTemplatesTable.createdBy, userId));
		}

		const taskTemplates = await db.query.referencesTaskTemplatesTable.findMany({
			where: and(...whereConditions),
			orderBy: asc(referencesTaskTemplatesTable.createdAt),
			columns: {
				id: true,
				translationKey: true,
			},
		});
		res.json(taskTemplates);
	} catch (error) {
		handleError(res, error);
	}
};
