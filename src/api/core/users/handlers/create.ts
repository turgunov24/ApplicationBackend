import { getAuthUserId } from '../../../../utils/getAuthUserId';
import db from '../../../../db';
import { usersTable } from '../../../../db/schemas/users';
import { usersRolesTable } from '../../../../db/schemas/usersRoles';
import { Request, Response } from 'express';
import { CreatePayload } from '../validators';
import bcrypt from 'bcryptjs';
import { handleError } from '../../../../utils/handleError';
import { generateErrorMessage } from '../../../../utils/generateErrorMessage';

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - username
 *               - password
 *               - email
 *               - phone
 *               - countryId
 *               - regionId
 *               - districtId
 *               - roles
 *             properties:
 *               fullName:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               countryId:
 *                 type: integer
 *               regionId:
 *                 type: integer
 *               districtId:
 *                 type: integer
 *               roles:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Array of role IDs
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 fullName:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 countryId:
 *                   type: integer
 *                 regionId:
 *                   type: integer
 *                 districtId:
 *                   type: integer
 *                 status:
 *                   type: string
 *                 avatarPath:
 *                   type: string
 *                   nullable: true
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Bad request
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

export const createHandler = async (
	req: Request<{}, {}, CreatePayload>,
	res: Response,
) => {
	try {
		const {
			fullName,
			username,
			password,
			email,
			phone,
			countryId,
			regionId,
			districtId,
			roles,
		} = req.body;

		const userId = getAuthUserId(req);

		if (!userId) {
			return res.status(401).json(generateErrorMessage('Unauthorized'));
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const result = await db
			.insert(usersTable)
			.values({
				createdBy: userId,
				fullName,
				username,
				password: hashedPassword,
				email,
				phone,
				countryId,
				regionId,
				districtId,
			})
			.returning();

		const newUser = result[0];

		const userRoles = roles.map((roleId) => ({
			userId: newUser.id,
			roleId: roleId,
		}));

		await db.insert(usersRolesTable).values(userRoles);

		res.status(201).json(newUser);
	} catch (error) {
		handleError(res, error);
	}
};
