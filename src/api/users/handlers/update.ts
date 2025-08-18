import { Request, Response } from 'express';
import { usersTable } from '../../../db/schemas/users';
import db from '../../../db';
import { eq } from 'drizzle-orm';
import { CreatePayload } from '../validators';
import bcrypt from 'bcryptjs';

export const updateHandler = async (
	req: Request<{}, {}, CreatePayload, { id: string }>,
	res: Response
) => {
	try {
		const { id } = req.query;
		const { fullName, username, password } = req.body;

		const hashedPassword = await bcrypt.hash(password, 10);

		await db
			.update(usersTable)
			.set({
				fullName,
				username,
				password: hashedPassword,
				updatedAt: new Date(),
			})
			.where(eq(usersTable.id, Number(id)))
			.returning();

		res.json({ message: 'User updated successfully' });
	} catch (error: unknown) {
		if (error instanceof Error) {
			res.status(500).json({ message: error.message });
		} else {
			res.status(500).json({ message: 'Internal server error' });
		}
	}
};
