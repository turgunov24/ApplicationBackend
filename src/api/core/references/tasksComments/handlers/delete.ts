import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { referencesTasksCommentsTable } from '../../../../../db/schemas/references/tasksComments';
import db from '../../../../../db';
import { handleError } from '../../../../../utils/handleError';

export const deleteHandler = async (
	req: Request<{}, {}, {}, { id: string }>,
	res: Response,
) => {
	try {
		const { id } = req.query;

		await db
			.update(referencesTasksCommentsTable)
			.set({ status: 'deleted', updatedAt: new Date() })
			.where(eq(referencesTasksCommentsTable.id, Number(id)))
			.returning();

		res.json({ message: 'Tasks comment deleted successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
