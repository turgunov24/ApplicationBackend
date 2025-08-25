import { Request, Response } from 'express';
import db from '../../../../db';
import { referencesPermissionGroupsTable } from '../../../../db/schemas';
import { handleError } from '../../../../utils/handleError';
import { ne } from 'drizzle-orm';

export const listHandler = async (req: Request, res: Response) => {
	try {
		const permissionGroups = await db
			.select({
				id: referencesPermissionGroupsTable.id,
				nameUz: referencesPermissionGroupsTable.nameUz,
				nameRu: referencesPermissionGroupsTable.nameRu,
			})
			.from(referencesPermissionGroupsTable)
			.where(ne(referencesPermissionGroupsTable.status, 'deleted'));
		res.json(permissionGroups);
	} catch (error) {
		handleError(res, error);
	}
};
