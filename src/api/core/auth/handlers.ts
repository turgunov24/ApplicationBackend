import { Request, Response } from 'express';
import { LoginPayload } from './validator';
import db from '../../../db';
import { usersTable } from '../../../db/schemas/users';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generateErrorMessage } from '../../../utils/generateErrorMessage';
import { handleError } from '../../../utils/handleError';
import { pick } from 'es-toolkit/object';

/**
 * @swagger
 * /api/core/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
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
 *                 user:
 *                   type: object
 *                   properties:
 *                     fullName:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                 permissions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       action:
 *                         type: string
 *                       resource:
 *                         type: string
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
export const loginHandler = async (
	req: Request<{}, {}, LoginPayload>,
	res: Response,
) => {
	try {
		const { username, password } = req.body;

		const user = await db.query.usersTable.findFirst({
			where: eq(usersTable.username, username),
			with: {
				userRoles: {
					with: {
						role: {
							with: {
								rolesPermissions: {
									with: {
										permission: {
											columns: {
												action: true,
												resource: true,
											},
										},
									},
								},
							},
						},
					},
				},
			},
		});

		if (!user) {
			return res.status(400).json(generateErrorMessage('Invalid credentials'));
		}

		const validPassword = await bcrypt.compare(password, user.password);

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
			{ id: user.id, username: user.username, email: user.email, type: 'user' },
			secret,
			{ expiresIn: '1h' },
		);

		await db
			.update(usersTable)
			.set({ token: accessToken, status: 'active' })
			.where(eq(usersTable.id, user.id));

		const permissions = user.userRoles.map(({ role }) =>
			role.rolesPermissions.map(({ permission }) => ({
				action: permission.action,
				resource: permission.resource,
			})),
		);
		return res.status(200).json({
			accessToken,
			user: pick(user, ['fullName', 'username', 'email']),
			permissions: permissions.flat(),
		});
	} catch (error: unknown) {
		handleError(res, error);
	}
};
