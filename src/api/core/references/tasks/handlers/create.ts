import { Request, Response } from 'express';
import { CreatePayload } from '../validators';
import { referencesTasksTable } from '../../../../../db/schemas/references/tasks';
import db from '../../../../../db';
import { handleError } from '../../../../../utils/handleError';
import { getAuthUserId } from '../../../../../utils/getAuthUserId';
import { generateErrorMessage } from '../../../../../utils/generateErrorMessage';

export const createHandler = async (
	req: Request<{}, {}, CreatePayload>,
	res: Response,
) => {
	try {
		const { translationKey, description, deadline, principalCustomerId } = req.body;

		const userId = getAuthUserId(req);

		if (!userId)
			return res.status(401).json(generateErrorMessage('Unauthorized'));

		const result = await db
			.insert(referencesTasksTable)
			.values({
				createdBy: userId,
				translationKey,
				description,
				deadline: deadline ? new Date(deadline) : undefined,
				principalCustomerId,
			})
			.returning();

		res.status(201).json(result[0]);
	} catch (error) {
		handleError(res, error);
	}
};
