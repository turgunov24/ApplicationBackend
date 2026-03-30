import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { CreatePayload } from '../validators';
import { referencesTasksTable } from '../../../../../db/schemas/references/tasks';
import db from '../../../../../db';
import { handleError } from '../../../../../utils/handleError';

export const updateHandler = async (
	req: Request<{}, {}, CreatePayload, { id: string }>,
	res: Response,
) => {
	try {
		const { id } = req.query;
		const { translationKey, description, deadline, principalCustomerId } = req.body;

		await db
			.update(referencesTasksTable)
			.set({
				translationKey,
				description,
				deadline: deadline ? new Date(deadline) : undefined,
				principalCustomerId,
				updatedAt: new Date(),
			})
			.where(eq(referencesTasksTable.id, Number(id)))
			.returning();

		res.json({ message: 'Task updated successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
