import { Request, Response } from 'express';
import db from '../../../../../db';
import { referencesLegalFormsTable } from '../../../../../db/schemas/references/legalForms';
import { handleError } from '../../../../../utils/handleError';
import { and, asc, eq, ne } from 'drizzle-orm';
import { getAuthUserId } from '../../../../../utils/getAuthUserId';
import { SUPER_ADMIN_ID } from '../../../../../helpers/config';

export const listHandler = async (req: Request, res: Response) => {
	try {
		const userId = getAuthUserId(req);
		const whereConditions = [ne(referencesLegalFormsTable.status, 'deleted')];

		if (userId !== SUPER_ADMIN_ID) {
			whereConditions.push(
				eq(referencesLegalFormsTable.createdBy, userId),
			);
		}

		const legalForms = await db.query.referencesLegalFormsTable.findMany({
			where: and(...whereConditions),
			orderBy: asc(referencesLegalFormsTable.createdAt),
			columns: {
				id: true,
				name: true,
			},
		});
		res.json(legalForms);
	} catch (error) {
		handleError(res, error);
	}
};
