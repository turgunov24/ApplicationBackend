import { Request, Response } from 'express';
import { usersTable } from '../../../db/schemas/users';
import db from '../../../db';
import { eq } from 'drizzle-orm';

export const deleteHandler = async (
	req: Request<{}, {}, {}, { id: string }>,
	res: Response
) => {
	try {
		const { id } = req.query;

		const result = await db
			.delete(usersTable)
			.where(eq(usersTable.id, Number(id)))
			.returning();

		if (result.length === 0) {
			res.status(404).json({ message: 'User not found' });
		} else {
			res.json({ message: 'User deleted successfully' });
		}
	} catch (error: unknown) {
		if (error instanceof Error) {
			res.status(500).json({ message: error.message });
		} else {
			res.status(500).json({ message: 'Internal server error' });
		}
	}
};
