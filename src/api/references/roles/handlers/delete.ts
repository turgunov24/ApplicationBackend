import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { referencesRolesTable } from '../../../../db/schemas/references/roles';
import db from '../../../../db';
import { handleError } from '../../../../utils/handleError';

export const deleteHandler = async (
	req: Request<{}, {}, {}, { id: string }>,
	res: Response
) => {
	try {
		const { id } = req.query;

		await db
			.update(referencesRolesTable)
			.set({ status: 'deleted', updatedAt: new Date() })
			.where(eq(referencesRolesTable.id, Number(id)))
			.returning();

		res.json({ message: 'Role deleted successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
