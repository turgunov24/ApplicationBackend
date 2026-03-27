import { Request, Response } from 'express';
import { eq, and, ne } from 'drizzle-orm';
import db from '../../../../../db';
import {
	referencesTranslationsTable,
	referencesUserTranslationsTable,
} from '../../../../../db/schemas';
import { handleError } from '../../../../../utils/handleError';
import { getAuthUserId } from '../../../../../utils/getAuthUserId';

interface BundleParams {
	[key: string]: string;
	lang: string;
	ns: string;
}

export const bundleHandler = async (
	req: Request<BundleParams>,
	res: Response,
) => {
	try {
		const { lang, ns } = req.params;

		// 1. Get global translations
		const globalTranslations =
			await db.query.referencesTranslationsTable.findMany({
				where: and(
					eq(referencesTranslationsTable.lang, lang),
					eq(referencesTranslationsTable.namespace, ns),
					ne(referencesTranslationsTable.status, 'deleted'),
				),
				columns: {
					key: true,
					value: true,
				},
			});

		// 2. Build flat { key: value }
		const result: Record<string, string> = {};

		for (const row of globalTranslations) {
			result[row.key] = row.value;
		}

		// 3. Get user-specific translations (override global)
		const userId = getAuthUserId(req);

		if (userId) {
			const userTranslations =
				await db.query.referencesUserTranslationsTable.findMany({
					where: and(
						eq(referencesUserTranslationsTable.userId, userId),
						eq(referencesUserTranslationsTable.lang, lang),
						eq(
							referencesUserTranslationsTable.namespace,
							ns,
						),
						ne(referencesUserTranslationsTable.status, 'deleted'),
					),
					columns: {
						key: true,
						value: true,
					},
				});

			for (const row of userTranslations) {
				result[row.key] = row.value;
			}
		}

		res.json(result);
	} catch (error: unknown) {
		handleError(res, error);
	}
};
