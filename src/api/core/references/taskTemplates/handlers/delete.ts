import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { referencesTaskTemplatesTable } from '../../../../../db/schemas/references/taskTemplates';
import db from '../../../../../db';
import { handleError } from '../../../../../utils/handleError';

export const deleteHandler = async (
	req: Request<{}, {}, {}, { id: string }>,
	res: Response,
) => {
	try {
		const { id } = req.query;

		await db
			.update(referencesTaskTemplatesTable)
			.set({ status: 'deleted', updatedAt: new Date() })
			.where(eq(referencesTaskTemplatesTable.id, Number(id)))
			.returning();

		res.json({ message: 'Task template deleted successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
