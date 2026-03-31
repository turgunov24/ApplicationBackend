import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { CreatePayload } from '../validators';
import { referencesTaskActionsHistoryTable } from '../../../../../db/schemas/references/taskActionsHistory';
import { referencesTasksTable } from '../../../../../db/schemas/references/tasks';
import db from '../../../../../db';
import { handleError } from '../../../../../utils/handleError';
import { getAuthUserId } from '../../../../../utils/getAuthUserId';
import { generateErrorMessage } from '../../../../../utils/generateErrorMessage';

export const changeStatusHandler = async (
	req: Request<{}, {}, CreatePayload>,
	res: Response,
) => {
	try {
		const { taskId, type, status } = req.body;

		const userId = getAuthUserId(req);

		if (!userId)
			return res.status(401).json(generateErrorMessage('Unauthorized'));

		await db
			.update(referencesTasksTable)
			.set({ status, updatedAt: new Date() })
			.where(eq(referencesTasksTable.id, taskId));

		const result = await db
			.insert(referencesTaskActionsHistoryTable)
			.values({
				taskId,
				type,
				status,
				createdBy: userId,
			})
			.returning();

		res.status(201).json(result[0]);
	} catch (error) {
		handleError(res, error);
	}
};
