import { Request, Response } from 'express';
import db from '../../../../../db';
import { referencesServicesTable } from '../../../../../db/schemas/references/services';
import { handleError } from '../../../../../utils/handleError';
import { and, asc, eq, ne } from 'drizzle-orm';
import { getAuthUserId } from '../../../../../utils/getAuthUserId';
import { SUPER_ADMIN_ID } from '../../../../../helpers/config';

export const listHandler = async (req: Request, res: Response) => {
	try {
		const userId = getAuthUserId(req);
		const whereConditions = [ne(referencesServicesTable.status, 'deleted')];

		if (userId !== SUPER_ADMIN_ID) {
			whereConditions.push(
				eq(referencesServicesTable.createdBy, userId),
			);
		}

		const services = await db.query.referencesServicesTable.findMany({
			where: and(...whereConditions),
			orderBy: asc(referencesServicesTable.createdAt),
			columns: {
				id: true,
				name: true,
			},
		});
		res.json(services);
	} catch (error) {
		handleError(res, error);
	}
};
