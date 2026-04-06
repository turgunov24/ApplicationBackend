import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { referencesTaskTemplateCategoriesTable } from '../../../../../db/schemas/references/taskTemplateCategories';
import db from '../../../../../db';
import { handleError } from '../../../../../utils/handleError';

export const deleteHandler = async (
	req: Request<{}, {}, {}, { id: string }>,
	res: Response,
) => {
	try {
		const { id } = req.query;

		await db
			.update(referencesTaskTemplateCategoriesTable)
			.set({ status: 'deleted', updatedAt: new Date() })
			.where(eq(referencesTaskTemplateCategoriesTable.id, Number(id)))
			.returning();

		res.json({ message: 'Task template category deleted successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
