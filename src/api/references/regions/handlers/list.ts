import { Request, Response } from 'express';
import db from '../../../../db';
import { referencesRegionsTable } from '../../../../db/schemas';
import { handleError } from '../../../../utils/handleError';
import { and, eq, ne } from 'drizzle-orm';
import { ListValidationSchema } from '../validators';

export const listHandler = async (
	req: Request<{}, {}, {}, ListValidationSchema>,
	res: Response
) => {
	try {
		const { countryId } = req.query;

		if (countryId) {
			const regions = await db
				.select({
					id: referencesRegionsTable.id,
					nameUz: referencesRegionsTable.nameUz,
					nameRu: referencesRegionsTable.nameRu,
					countryId: referencesRegionsTable.countryId,
				})
				.from(referencesRegionsTable)
				.where(
					and(
						ne(referencesRegionsTable.status, 'deleted'),
						eq(referencesRegionsTable.countryId, Number(countryId))
					)
				);
			res.json(regions);
			return;
		}

		const regions = await db
			.select({
				id: referencesRegionsTable.id,
				nameUz: referencesRegionsTable.nameUz,
				nameRu: referencesRegionsTable.nameRu,
				countryId: referencesRegionsTable.countryId,
			})
			.from(referencesRegionsTable)
			.where(ne(referencesRegionsTable.status, 'deleted'));
		res.json(regions);
	} catch (error) {
		handleError(res, error);
	}
};
