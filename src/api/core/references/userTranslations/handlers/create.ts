import { Request, Response } from 'express';
import { CreatePayload } from '../validators';
import { referencesUserTranslationsTable } from '../../../../../db/schemas/references/userTranslations';
import db from '../../../../../db';
import { handleError } from '../../../../../utils/handleError';
import { getAuthUserId } from '../../../../../utils/getAuthUserId';
import { generateErrorMessage } from '../../../../../utils/generateErrorMessage';

export const createHandler = async (
	req: Request<{}, {}, CreatePayload>,
	res: Response,
) => {
	try {
		const { userId: targetUserId, lang, namespace, key, value } = req.body;

		const userId = getAuthUserId(req);

		if (!userId)
			return res.status(401).json(generateErrorMessage('Unauthorized'));

		const result = await db
			.insert(referencesUserTranslationsTable)
			.values({
				createdBy: userId,
				userId: targetUserId,
				lang,
				namespace,
				key,
				value,
			})
			.returning();

		res.status(201).json(result[0]);
	} catch (error) {
		handleError(res, error);
	}
};
