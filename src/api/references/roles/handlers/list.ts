import { Request, Response } from 'express';
import db from '../../../../db';
import { referencesRolesTable } from '../../../../db/schemas/references/roles';
import { handleError } from '../../../../utils/handleError';
import { ne } from 'drizzle-orm';

export const listHandler = async (req: Request, res: Response) => {
	try {
		const roles = await db
			.select({
				id: referencesRolesTable.id,
				nameUz: referencesRolesTable.nameUz,
				nameRu: referencesRolesTable.nameRu,
				descriptionUz: referencesRolesTable.descriptionUz,
				descriptionRu: referencesRolesTable.descriptionRu,
			})
			.from(referencesRolesTable)
			.where(ne(referencesRolesTable.status, 'deleted'));
		res.json(roles);
	} catch (error) {
		handleError(res, error);
	}
};
