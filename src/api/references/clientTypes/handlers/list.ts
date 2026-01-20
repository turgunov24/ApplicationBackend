import { Request, Response } from 'express';
import db from '../../../../db';
import { referencesClientTypesTable } from '../../../../db/schemas';
import { handleError } from '../../../../utils/handleError';
import { asc, ne } from 'drizzle-orm';

export const listHandler = async (req: Request, res: Response) => {
	try {
		const clientTypes = await db.query.referencesClientTypesTable.findMany({
			where: ne(referencesClientTypesTable.status, 'deleted'),
			orderBy: asc(referencesClientTypesTable.createdAt),
			columns: {
				id: true,
				nameUz: true,
				nameRu: true,
			},
		});
		res.json(clientTypes);
	} catch (error) {
		handleError(res, error);
	}
};
