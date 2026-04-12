import { Request, Response } from 'express';
import db from '../../../../../db';
import { referencesAttachTemplateToTaskTable } from '../../../../../db/schemas/references/attachTemplateToTask';
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

		const whereConditions = [ne(referencesAttachTemplateToTaskTable.status, 'deleted')];

		if (userId !== SUPER_ADMIN_ID) {
			whereConditions.push(eq(referencesAttachTemplateToTaskTable.createdBy, userId));
		}

		const records = await db.query.referencesAttachTemplateToTaskTable.findMany({
			where: and(...whereConditions),
			orderBy: asc(referencesAttachTemplateToTaskTable.createdAt),
			columns: {
				id: true,
				principalCustomerId: true,
				taskTemplateId: true,
				startDate: true,
				endDate: true,
			},
			with: {
				taskTemplate: {
					columns: {
						id: true,
						translationKey: true,
					},
				},
				principalCustomer: {
					columns: {
						id: true,
						name: true,
					},
				},
			},
		});
		res.json(records);
	} catch (error) {
		handleError(res, error);
	}
};
