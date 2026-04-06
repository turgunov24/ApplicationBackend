import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { CreatePayload } from '../validators';
import { referencesTaskTemplateCategoriesTable } from '../../../../../db/schemas/references/taskTemplateCategories';
import db from '../../../../../db';
import { handleError } from '../../../../../utils/handleError';

export const updateHandler = async (
	req: Request<{}, {}, CreatePayload, { id: string }>,
	res: Response,
) => {
	try {
		const { id } = req.query;
		const { translationKey } = req.body;

		await db
			.update(referencesTaskTemplateCategoriesTable)
			.set({
				translationKey,
				updatedAt: new Date(),
			})
			.where(eq(referencesTaskTemplateCategoriesTable.id, Number(id)))
			.returning();

		res.json({ message: 'Task template category updated successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
