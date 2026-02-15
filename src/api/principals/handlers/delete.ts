import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import db from '../../../db';
import { principalsTable } from '../../../db/schemas/principals';
import { handleError } from '../../../utils/handleError'

export const deleteHandler = async (
	req: Request<{}, {}, {}, { id: string }>,
	res: Response,
) => {
	try {
		const { id } = req.query;

		await db
			.update(principalsTable)
			.set({ status: 'deleted' })
			.where(eq(principalsTable.id, parseInt(id)));

		res.json({ message: 'Principal deleted successfully' });
	} catch (error) {
		handleError(res, error);
	}
};
