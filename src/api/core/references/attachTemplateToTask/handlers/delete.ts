import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { referencesAttachTemplateToTaskTable } from '../../../../../db/schemas/references/attachTemplateToTask';
import db from '../../../../../db';
import { handleError } from '../../../../../utils/handleError';

export const deleteHandler = async (
	req: Request<{}, {}, {}, { id: string }>,
	res: Response,
) => {
	try {
		const { id } = req.query;

		await db
			.update(referencesAttachTemplateToTaskTable)
			.set({ status: 'deleted', updatedAt: new Date() })
			.where(eq(referencesAttachTemplateToTaskTable.id, Number(id)))
			.returning();

		res.json({ message: 'Attach template to task deleted successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
