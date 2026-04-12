import { Request, Response } from 'express';
import { CreatePayload } from '../validators';
import { referencesAttachTemplateToTaskTable } from '../../../../../db/schemas/references/attachTemplateToTask';
import db from '../../../../../db';
import { handleError } from '../../../../../utils/handleError';
import { getAuthUserId } from '../../../../../utils/getAuthUserId';
import { generateErrorMessage } from '../../../../../utils/generateErrorMessage';

export const createHandler = async (
	req: Request<{}, {}, CreatePayload>,
	res: Response,
) => {
	try {
		const { principalCustomerId, taskTemplateIds, startDate, endDate } =
			req.body;

		const userId = getAuthUserId(req);

		if (!userId)
			return res.status(401).json(generateErrorMessage('Unauthorized'));

		const insertValues = taskTemplateIds.map(tId => ({
			createdBy: userId,
			principalCustomerId,
			taskTemplateId: tId,
			startDate: startDate ? new Date(startDate) : undefined,
			endDate: endDate ? new Date(endDate) : undefined,
		}));

		const result = await db
			.insert(referencesAttachTemplateToTaskTable)
			.values(insertValues)
			.returning();

		res.status(201).json(result[0]);
	} catch (error) {
		handleError(res, error);
	}
};
