import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { CreatePayload } from '../validators';
import { referencesTaskRecurrenceTable } from '../../../../../db/schemas/references/taskRecurrence';
import db from '../../../../../db';
import { handleError } from '../../../../../utils/handleError';

export const updateHandler = async (
	req: Request<{}, {}, CreatePayload, { id: string }>,
	res: Response,
) => {
	try {
		const { id } = req.query;
		const { translationKey, token, description } = req.body;

		await db
			.update(referencesTaskRecurrenceTable)
			.set({
				translationKey,
				token,
				description,
				updatedAt: new Date(),
			})
			.where(eq(referencesTaskRecurrenceTable.id, Number(id)))
			.returning();

		res.json({ message: 'Task recurrence updated successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
