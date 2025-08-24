import { Request, Response } from 'express';
import db from '../../../../db';
import { referencesDistrictsTable } from '../../../../db/schemas';
import { handleError } from '../../../../utils/handleError';
import { and, eq, ne } from 'drizzle-orm';
import { ListValidationSchema } from '../validators';

export const listHandler = async (
	req: Request<{}, {}, {}, ListValidationSchema>,
	res: Response
) => {
	try {
		const { regionId } = req.query;

		if (regionId) {
			const districts = await db
				.select({
					id: referencesDistrictsTable.id,
					nameUz: referencesDistrictsTable.nameUz,
					nameRu: referencesDistrictsTable.nameRu,
					regionId: referencesDistrictsTable.regionId,
				})
				.from(referencesDistrictsTable)
				.where(
					and(
						ne(referencesDistrictsTable.status, 'deleted'),
						eq(referencesDistrictsTable.regionId, Number(regionId))
					)
				);
			res.json(districts);
			return;
		}

		const districts = await db
			.select({
				id: referencesDistrictsTable.id,
				nameUz: referencesDistrictsTable.nameUz,
				nameRu: referencesDistrictsTable.nameRu,
				regionId: referencesDistrictsTable.regionId,
			})
			.from(referencesDistrictsTable)
			.where(ne(referencesDistrictsTable.status, 'deleted'));
		res.json(districts);
	} catch (error) {
		handleError(res, error);
	}
};
