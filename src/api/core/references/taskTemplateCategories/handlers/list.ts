import { Request, Response } from 'express';
import db from '../../../../../db';
import { referencesTaskTemplateCategoriesTable } from '../../../../../db/schemas';
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

		const whereConditions = [ne(referencesTaskTemplateCategoriesTable.status, 'deleted')];

		if (userId !== SUPER_ADMIN_ID) {
			whereConditions.push(eq(referencesTaskTemplateCategoriesTable.createdBy, userId));
		}

		const taskTemplateCategories = await db.query.referencesTaskTemplateCategoriesTable.findMany({
			where: and(...whereConditions),
			orderBy: asc(referencesTaskTemplateCategoriesTable.createdAt),
			columns: {
				id: true,
				translationKey: true,
			},
		});
		res.json(taskTemplateCategories);
	} catch (error) {
		handleError(res, error);
	}
};
