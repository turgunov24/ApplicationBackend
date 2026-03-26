import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { CreatePayload } from '../validators';
import { referencesTranslationsTable } from '../../../../../db/schemas/references/translations';
import db from '../../../../../db';
import { handleError } from '../../../../../utils/handleError';

export const updateHandler = async (
	req: Request<{}, {}, CreatePayload, { id: string }>,
	res: Response,
) => {
	try {
		const { id } = req.query;
		const { lang, namespace, key, value } = req.body;

		await db
			.update(referencesTranslationsTable)
			.set({
				lang,
				namespace,
				key,
				value,
				updatedAt: new Date(),
			})
			.where(eq(referencesTranslationsTable.id, Number(id)))
			.returning();

		res.json({ message: 'Translation updated successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
