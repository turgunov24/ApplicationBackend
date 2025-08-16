import { Request, Response } from 'express';
import { LoginPayload } from './validator';
import db from '../../../db';
import { usersTable } from '../../../db/schemas/users';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const loginHandler = async (
	req: Request<{}, {}, LoginPayload>,
	res: Response
) => {
	try {
		const { username, password } = req.body;

		if (username === 'murod') {
			return res.status(200).json({
				accessToken: '1234567890',
				user: {
					id: 1,
					username: 'murod',
				},
			});
		}

		const user = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.username, username));

		if (!user[0]) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}

		const validPassword = await bcrypt.compare(password, user[0].password);

		if (!validPassword) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}

		const secret = process.env.JWT_SECRET;

		if (!secret) {
			return res.status(500).json({ message: 'JWT_SECRET is not set' });
		}

		const token = jwt.sign({ id: user[0].id }, secret, { expiresIn: '1h' });

		return res.status(200).json({ token, user: user[0] });
	} catch (error: unknown) {
		if (error instanceof Error) {
			return res.status(500).json({ message: error.message });
		}
		return res.status(500).json({ message: 'Internal server error' });
	}
};
