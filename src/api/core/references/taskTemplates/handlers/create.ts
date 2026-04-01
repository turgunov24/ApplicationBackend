import { Request, Response } from 'express';
import { CreatePayload } from '../validators';
import { referencesTaskTemplatesTable } from '../../../../../db/schemas/references/taskTemplates';
import db from '../../../../../db';
import { handleError } from '../../../../../utils/handleError';
import { getAuthUserId } from '../../../../../utils/getAuthUserId';
import { generateErrorMessage } from '../../../../../utils/generateErrorMessage';

export const createHandler = async (
	req: Request<{}, {}, CreatePayload>,
	res: Response,
) => {
	try {
		const { translationKey, description, recurrence, date, dayOfMonth, monthOfQuarter, monthOfYear } = req.body;

		const userId = getAuthUserId(req);

		if (!userId)
			return res.status(401).json(generateErrorMessage('Unauthorized'));

		const result = await db
			.insert(referencesTaskTemplatesTable)
			.values({
				createdBy: userId,
				translationKey,
				description,
				recurrence,
				date: date ? new Date(date) : undefined,
				dayOfMonth,
				monthOfQuarter,
				monthOfYear,
			})
			.returning();

		res.status(201).json(result[0]);
	} catch (error) {
		handleError(res, error);
	}
};
