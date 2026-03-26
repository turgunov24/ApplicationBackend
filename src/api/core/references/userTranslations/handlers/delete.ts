import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { referencesUserTranslationsTable } from '../../../../../db/schemas/references/userTranslations';
import db from '../../../../../db';
import { handleError } from '../../../../../utils/handleError';

export const deleteHandler = async (
	req: Request<{}, {}, {}, { id: string }>,
	res: Response,
) => {
	try {
		const { id } = req.query;

		await db
			.update(referencesUserTranslationsTable)
			.set({ status: 'deleted', updatedAt: new Date() })
			.where(eq(referencesUserTranslationsTable.id, Number(id)))
			.returning();

		res.json({ message: 'User translation deleted successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
