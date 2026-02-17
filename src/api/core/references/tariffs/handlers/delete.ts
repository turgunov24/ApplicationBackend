import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { referencesTariffsTable } from '../../../../../db/schemas/references/tariffs';
import db from '../../../../../db';
import { handleError } from '../../../../../utils/handleError';

export const deleteHandler = async (
	req: Request<{}, {}, {}, { id: string }>,
	res: Response,
) => {
	try {
		const { id } = req.query;

		await db
			.update(referencesTariffsTable)
			.set({ status: 'deleted', updatedAt: new Date() })
			.where(eq(referencesTariffsTable.id, Number(id)))
			.returning();

		res.json({ message: 'Tariff deleted successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
