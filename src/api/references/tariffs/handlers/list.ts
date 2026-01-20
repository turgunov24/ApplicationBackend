import { Request, Response } from 'express';
import db from '../../../../db';
import { referencesTariffsTable } from '../../../../db/schemas';
import { handleError } from '../../../../utils/handleError';
import { asc, ne } from 'drizzle-orm';

export const listHandler = async (req: Request, res: Response) => {
	try {
		const tariffs = await db.query.referencesTariffsTable.findMany({
			where: ne(referencesTariffsTable.status, 'deleted'),
			orderBy: asc(referencesTariffsTable.createdAt),
			columns: {
				id: true,
				nameUz: true,
				nameRu: true,
				monthlyPrice: true,
			},
			with: {
				currency: {
					columns: {
						id: true,
						nameUz: true,
					},
				},
			},
		});
		res.json(tariffs);
	} catch (error) {
		handleError(res, error);
	}
};
