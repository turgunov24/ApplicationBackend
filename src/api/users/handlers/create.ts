import db from '../../../db';
import { usersTable } from '../../../db/schemas/users';
import { usersRolesTable } from '../../../db/schemas/usersRoles';
import { Request, Response } from 'express';
import { CreatePayload } from '../validators';
import bcrypt from 'bcryptjs';
import { handleError } from '../../../utils/handleError';

/**
 * @swagger
 * /api/users/create:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
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
 *               - roles
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: User's full name
 *               username:
 *                 type: string
 *                 description: Username for login
 *               password:
 *                 type: string
 *                 description: User's password
 *               email:
 *                 type: string
 *                 description: User's email
 *               phone:
 *                 type: string
 *                 description: User's phone number
 *               countryId:
 *                 type: integer
 *                 description: Country ID
 *               regionId:
 *                 type: integer
 *                 description: Region ID
 *               districtId:
 *                 type: integer
 *                 description: District ID
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
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 status:
 *                   type: string
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
	res: Response
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

		const hashedPassword = await bcrypt.hash(password, 10);

		const result = await db
			.insert(usersTable)
			.values({
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
