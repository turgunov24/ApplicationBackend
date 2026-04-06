import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { referencesTaskRecurrenceTable } from '../../../../../db/schemas/references/taskRecurrence';
import db from '../../../../../db';
import { handleError } from '../../../../../utils/handleError';

export const deleteHandler = async (
	req: Request<{}, {}, {}, { id: string }>,
	res: Response,
) => {
	try {
		const { id } = req.query;

		await db
			.update(referencesTaskRecurrenceTable)
			.set({ status: 'deleted', updatedAt: new Date() })
			.where(eq(referencesTaskRecurrenceTable.id, Number(id)))
			.returning();

		res.json({ message: 'Task recurrence deleted successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
