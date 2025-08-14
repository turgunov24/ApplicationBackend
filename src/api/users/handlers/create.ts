import db from '../../../db';
import { usersTable } from '../../../db/schemas/users';
import { Request, Response } from 'express';
import { CreatePayload } from '../validators';
import bcrypt from 'bcryptjs';

export const createHandler = async (
	req: Request<{}, {}, CreatePayload>,
	res: Response
) => {
	try {
		const { name, username, password } = req.body;

		const hashedPassword = await bcrypt.hash(password, 10);

		const result = await db
			.insert(usersTable)
			.values({
				name,
				username,
				password: hashedPassword,
			})
			.returning();
		res.status(201).json(result[0]);
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({ message: error.message });
		} else {
			res.status(500).json({ message: 'Internal server error' });
		}
		console.log(error);
	}
};
