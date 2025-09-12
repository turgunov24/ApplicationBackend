import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import db from '../db';
import { usersTable } from '../db/schemas/users';
import { eq } from 'drizzle-orm';
import { generateErrorMessage } from '../utils/generateErrorMessage';
import { handleError } from '../utils/handleError';
import '../types/auth';

export const parseUserFromToken = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		// Get token from Authorization header
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return res
				.status(401)
				.json(generateErrorMessage('Access token is required'));
		}

		const token = authHeader.substring(7); // Remove 'Bearer ' prefix

		// Verify JWT token
		const secret = process.env.JWT_SECRET;

		if (!secret) {
			return res
				.status(500)
				.json(generateErrorMessage('JWT_SECRET is not configured'));
		}

		let decoded: JwtPayload | string;

		try {
			const result = jwt.verify(token, secret);
			if (typeof result === 'object') {
				decoded = result;
			} else {
				throw Error('Decoded user is string');
			}
		} catch (error: unknown) {
			if (error instanceof Error) {
				return res.status(401).json(generateErrorMessage(error.message));
			}
			return res
				.status(401)
				.json(generateErrorMessage('Invalid or expired token'));
		}

		const { username } = decoded;

		if (!username)
			return res.status(401).json(generateErrorMessage('Username undefined'));

		// Get user from database
		const users = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.username, username));

		if (!users.length) {
			return res.status(401).json(generateErrorMessage('User not found'));
		}

		const user = users[0];

		// Check if user is active
		if (user.status !== 'active') {
			return res
				.status(403)
				.json(generateErrorMessage('User account is not active'));
		}

		// Attach user to request
		req.user = user;

		next();
	} catch (error: unknown) {
		handleError(res, error);
	}
};
