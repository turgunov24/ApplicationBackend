import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { referencesRegionsTable } from '../../../../db/schemas/references/regions';
import db from '../../../../db';
import { handleError } from '../../../../utils/handleError';

export const deleteHandler = async (
	req: Request<{}, {}, {}, { id: string }>,
	res: Response
) => {
	try {
		const { id } = req.query;

		await db
			.update(referencesRegionsTable)
			.set({ status: 'deleted', updatedAt: new Date() })
			.where(eq(referencesRegionsTable.id, Number(id)))
			.returning();

		res.json({ message: 'Region deleted successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
