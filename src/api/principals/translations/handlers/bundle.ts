import { Request, Response } from 'express';
import { eq, and, ne } from 'drizzle-orm';
import db from '../../../../db';
import { referencesTranslationsTable } from '../../../../db/schemas';
import { handleError } from '../../../../utils/handleError';

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

		// Get global translations
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

		// Build flat { key: value }
		const result: Record<string, string> = {};

		for (const row of globalTranslations) {
			result[row.key] = row.value;
		}

		res.json(result);
	} catch (error: unknown) {
		handleError(res, error);
	}
};
