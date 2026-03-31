import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { CreatePayload } from '../validators';
import { referencesTasksCommentsTable } from '../../../../../db/schemas/references/tasksComments';
import db from '../../../../../db';
import { handleError } from '../../../../../utils/handleError';

export const updateHandler = async (
	req: Request<{}, {}, CreatePayload, { id: string }>,
	res: Response,
) => {
	try {
		const { id } = req.query;
		const { text, taskId } = req.body;

		await db
			.update(referencesTasksCommentsTable)
			.set({
				text,
				taskId,
				updatedAt: new Date(),
			})
			.where(eq(referencesTasksCommentsTable.id, Number(id)))
			.returning();

		res.json({ message: 'Tasks comment updated successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
