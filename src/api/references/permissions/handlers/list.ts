import { Request, Response } from 'express';
import db from '../../../../db';
import { referencesPermissionsTable } from '../../../../db/schemas';
import { handleError } from '../../../../utils/handleError';
import { and, eq, ne } from 'drizzle-orm';
import { ListValidationSchema } from '../validators';

export const listHandler = async (
	req: Request<{}, {}, {}, ListValidationSchema>,
	res: Response
) => {
	try {
		const { permissionGroupId } = req.query;

		if (permissionGroupId) {
			const permissions = await db
				.select({
					id: referencesPermissionsTable.id,
					nameUz: referencesPermissionsTable.nameUz,
					nameRu: referencesPermissionsTable.nameRu,
					permissionGroupId: referencesPermissionsTable.permissionGroupId,
				})
				.from(referencesPermissionsTable)
				.where(
					and(
						ne(referencesPermissionsTable.status, 'deleted'),
						eq(
							referencesPermissionsTable.permissionGroupId,
							Number(permissionGroupId)
						)
					)
				);
			res.json(permissions);
			return;
		}

		const permissions = await db
			.select({
				id: referencesPermissionsTable.id,
				nameUz: referencesPermissionsTable.nameUz,
				nameRu: referencesPermissionsTable.nameRu,
				permissionGroupId: referencesPermissionsTable.permissionGroupId,
			})
			.from(referencesPermissionsTable)
			.where(ne(referencesPermissionsTable.status, 'deleted'));
		res.json(permissions);
	} catch (error) {
		handleError(res, error);
	}
};
