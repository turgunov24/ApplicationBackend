import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { referencesPermissionsTable } from '../../../../db/schemas/references/permissions';
import db from '../../../../db';
import { handleError } from '../../../../utils/handleError';

export const deleteHandler = async (
	req: Request<{}, {}, {}, { id: string }>,
	res: Response
) => {
	try {
		const { id } = req.query;

		await db
			.update(referencesPermissionsTable)
			.set({ status: 'deleted', updatedAt: new Date() })
			.where(eq(referencesPermissionsTable.id, Number(id)))
			.returning();

		res.json({ message: 'Permission deleted successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
