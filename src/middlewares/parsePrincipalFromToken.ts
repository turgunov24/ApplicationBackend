import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import db from '../db';
import { principalsTable } from '../db/schemas/principals';
import { eq } from 'drizzle-orm';
import { generateErrorMessage } from '../utils/generateErrorMessage';
import { handleError } from '../utils/handleError';
import '../types/auth';
import { AuthenticatedPrincipal } from '../types/auth';

export const parsePrincipalFromToken = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	if (process.env.SKIP_AUTH === 'true') return next();

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
				throw Error('Decoded principal is string');
			}
		} catch (error: unknown) {
			if (error instanceof Error) {
				return res.status(401).json(generateErrorMessage(error.message));
			}
			return res
				.status(401)
				.json(generateErrorMessage('Invalid or expired token'));
		}

		const { username, type } = decoded;

		if (type !== 'principal')
			return res.status(401).json(generateErrorMessage('Invalid token type'));

		if (!username)
			return res.status(401).json(generateErrorMessage('Username undefined'));

		// Get principal from database
		const principals = await db
			.select()
			.from(principalsTable)
			.where(eq(principalsTable.username, username));

		if (!principals.length) {
			return res.status(401).json(generateErrorMessage('Principal not found'));
		}

		const principal = principals[0];

		// Check if principal is active
		if (principal.status !== 'active') {
			return res
				.status(403)
				.json(generateErrorMessage('Principal account is not active'));
		}

		req.principal = principal as AuthenticatedPrincipal;

		next();
	} catch (error: unknown) {
		handleError(res, error);
	}
};
