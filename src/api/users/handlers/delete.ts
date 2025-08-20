import { Request, Response } from 'express';
import { usersTable } from '../../../db/schemas/users';
import db from '../../../db';
import { eq } from 'drizzle-orm';
import { handleError } from '../../../utils/handleError';

export const deleteHandler = async (
	req: Request<{}, {}, {}, { id: string }>,
	res: Response
) => {
	try {
		const { id } = req.query;

		await db
			.update(usersTable)
			.set({ status: 'deleted', updatedAt: new Date() })
			.where(eq(usersTable.id, Number(id)))
			.returning();

		res.json({ message: 'User deleted successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
