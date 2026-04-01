import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { CreatePayload } from '../validators';
import { referencesTaskTemplatesTable } from '../../../../../db/schemas/references/taskTemplates';
import db from '../../../../../db';
import { handleError } from '../../../../../utils/handleError';

export const updateHandler = async (
	req: Request<{}, {}, CreatePayload, { id: string }>,
	res: Response,
) => {
	try {
		const { id } = req.query;
		const { translationKey, description, recurrence, date, dayOfMonth, monthOfQuarter, monthOfYear } = req.body;

		await db
			.update(referencesTaskTemplatesTable)
			.set({
				translationKey,
				description,
				recurrence,
				date: date ? new Date(date) : undefined,
				dayOfMonth,
				monthOfQuarter,
				monthOfYear,
				updatedAt: new Date(),
			})
			.where(eq(referencesTaskTemplatesTable.id, Number(id)))
			.returning();

		res.json({ message: 'Task template updated successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
