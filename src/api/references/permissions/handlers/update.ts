import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { CreatePayload } from '../validators';
import { referencesPermissionsTable } from '../../../../db/schemas/references/permissions';
import db from '../../../../db';
import { handleError } from '../../../../utils/handleError';

export const updateHandler = async (
	req: Request<{}, {}, CreatePayload, { id: string }>,
	res: Response
) => {
	try {
		const { id } = req.query;
		const { nameUz, nameRu, permissionGroupId, action, resource } = req.body;

		await db
			.update(referencesPermissionsTable)
			.set({
				nameUz,
				nameRu,
				permissionGroupId,
				action,
				resource,
				updatedAt: new Date(),
			})
			.where(eq(referencesPermissionsTable.id, Number(id)))
			.returning();

		res.json({ message: 'Permission updated successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
