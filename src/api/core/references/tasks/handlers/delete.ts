import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { referencesTasksTable } from '../../../../../db/schemas/references/tasks';
import db from '../../../../../db';
import { handleError } from '../../../../../utils/handleError';

export const deleteHandler = async (
	req: Request<{}, {}, {}, { id: string }>,
	res: Response,
) => {
	try {
		const { id } = req.query;

		await db
			.update(referencesTasksTable)
			.set({ status: 'deleted', updatedAt: new Date() })
			.where(eq(referencesTasksTable.id, Number(id)))
			.returning();

		res.json({ message: 'Task deleted successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
