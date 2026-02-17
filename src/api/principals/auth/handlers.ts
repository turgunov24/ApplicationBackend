import { Request, Response } from 'express';
import { PrincipalLoginPayload } from './validator';
import db from '../../../db';
import { principalsTable } from '../../../db/schemas/principals';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generateErrorMessage } from '../../../utils/generateErrorMessage';
import { handleError } from '../../../utils/handleError';
import { pick } from 'es-toolkit/object';

/**
 * @swagger
 * /api/principals/auth/login:
 *   post:
 *     summary: Login principal
 *     tags: [Auth Principals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required: [username, password]
 *     responses:
 *       200:
 *         description: Login success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 principal:
 *                   type: object
 *                   properties:
 *                     fullName:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 */
export const principalLoginHandler = async (
	req: Request<{}, {}, PrincipalLoginPayload>,
	res: Response,
) => {
	try {
		const { username, password } = req.body;

		const principal = await db.query.principalsTable.findFirst({
			where: eq(principalsTable.username, username),
		});

		if (!principal) {
			return res.status(400).json(generateErrorMessage('Invalid credentials'));
		}

		const validPassword = await bcrypt.compare(password, principal.password);

		if (!validPassword) {
			return res.status(400).json(generateErrorMessage('Invalid credentials'));
		}

		const secret = process.env.JWT_SECRET;

		if (!secret) {
			return res
				.status(500)
				.json(generateErrorMessage('JWT_SECRET is not set'));
		}

		const accessToken = jwt.sign(
			{
				id: principal.id,
				username: principal.username,
				email: principal.email,
				type: 'principal',
			},
			secret,
			{ expiresIn: '1h' },
		);

		await db
			.update(principalsTable)
			.set({ token: accessToken, status: 'active' })
			.where(eq(principalsTable.id, principal.id));

		return res.status(200).json({
			accessToken,
			principal: pick(principal, ['fullName', 'username', 'email']),
		});
	} catch (error: unknown) {
		handleError(res, error);
	}
};
