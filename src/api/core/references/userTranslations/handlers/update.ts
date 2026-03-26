import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { CreatePayload } from '../validators';
import { referencesUserTranslationsTable } from '../../../../../db/schemas/references/userTranslations';
import db from '../../../../../db';
import { handleError } from '../../../../../utils/handleError';

export const updateHandler = async (
	req: Request<{}, {}, CreatePayload, { id: string }>,
	res: Response,
) => {
	try {
		const { id } = req.query;
		const { userId: targetUserId, lang, namespace, key, value } = req.body;

		await db
			.update(referencesUserTranslationsTable)
			.set({
				userId: targetUserId,
				lang,
				namespace,
				key,
				value,
				updatedAt: new Date(),
			})
			.where(eq(referencesUserTranslationsTable.id, Number(id)))
			.returning();

		res.json({ message: 'User translation updated successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
