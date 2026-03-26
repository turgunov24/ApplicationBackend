import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { referencesTranslationsTable } from '../../../../../db/schemas/references/translations';
import db from '../../../../../db';
import { handleError } from '../../../../../utils/handleError';

export const deleteHandler = async (
	req: Request<{}, {}, {}, { id: string }>,
	res: Response,
) => {
	try {
		const { id } = req.query;

		await db
			.update(referencesTranslationsTable)
			.set({ status: 'deleted', updatedAt: new Date() })
			.where(eq(referencesTranslationsTable.id, Number(id)))
			.returning();

		res.json({ message: 'Translation deleted successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
