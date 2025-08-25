import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { CreatePayload } from '../validators';
import { referencesPermissionGroupsTable } from '../../../../db/schemas/references/permissionGroups';
import db from '../../../../db';
import { handleError } from '../../../../utils/handleError';

export const updateHandler = async (
	req: Request<{}, {}, CreatePayload, { id: string }>,
	res: Response
) => {
	try {
		const { id } = req.query;
		const { nameUz, nameRu } = req.body;

		await db
			.update(referencesPermissionGroupsTable)
			.set({
				nameUz,
				nameRu,
				updatedAt: new Date(),
			})
			.where(eq(referencesPermissionGroupsTable.id, Number(id)))
			.returning();

		res.json({ message: 'Permission group updated successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
