import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { referencesPermissionGroupsTable } from '../../../../db/schemas/references/permissionGroups';
import db from '../../../../db';
import { handleError } from '../../../../utils/handleError';

export const deleteHandler = async (
	req: Request<{}, {}, {}, { id: string }>,
	res: Response
) => {
	try {
		const { id } = req.query;

		await db
			.update(referencesPermissionGroupsTable)
			.set({ status: 'deleted', updatedAt: new Date() })
			.where(eq(referencesPermissionGroupsTable.id, Number(id)))
			.returning();

		res.json({ message: 'Permission group deleted successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
