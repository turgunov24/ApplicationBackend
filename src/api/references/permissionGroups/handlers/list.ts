import { Request, Response } from 'express';
import db from '../../../../db';
import {
	referencesPermissionGroupsTable,
	referencesPermissionsTable,
} from '../../../../db/schemas';
import { handleError } from '../../../../utils/handleError';
import { ne, eq } from 'drizzle-orm';

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

		// Fetch permissions for each permission group
		const permissionGroupsWithPermissions = await Promise.all(
			permissionGroups.map(async (group) => {
				const permissions = await db
					.select({
						id: referencesPermissionsTable.id,
						nameUz: referencesPermissionsTable.nameUz,
						nameRu: referencesPermissionsTable.nameRu,
					})
					.from(referencesPermissionsTable)
					.where(
						eq(referencesPermissionsTable.permissionGroupId, group.id) &&
							ne(referencesPermissionsTable.status, 'deleted')
					);

				return {
					...group,
					permissions,
				};
			})
		);

		res.json(permissionGroupsWithPermissions);
	} catch (error) {
		handleError(res, error);
	}
};
