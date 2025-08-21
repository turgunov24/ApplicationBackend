import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { referencesDistrictsTable } from '../../../../db/schemas/references/districts';
import db from '../../../../db';
import { handleError } from '../../../../utils/handleError';

export const deleteHandler = async (
	req: Request<{}, {}, {}, { id: string }>,
	res: Response
) => {
	try {
		const { id } = req.query;

		await db
			.update(referencesDistrictsTable)
			.set({ status: 'deleted', updatedAt: new Date() })
			.where(eq(referencesDistrictsTable.id, Number(id)))
			.returning();

		res.json({ message: 'District deleted successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
