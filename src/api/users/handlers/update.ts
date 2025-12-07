import { Request, Response } from 'express';
import { usersTable } from '../../../db/schemas/users';
import db from '../../../db';
import { eq } from 'drizzle-orm';
import { CreatePayload } from '../validators';
import bcrypt from 'bcryptjs';
import { handleError } from '../../../utils/handleError';
import { usersRolesTable } from '../../../db/schemas';

/**
 * @swagger
 * /api/users/update:
 *   put:
 *     summary: Update an existing user
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - username
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
 *                 description: User's password (optional for update)
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
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
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

export const updateHandler = async (
	req: Request<{}, {}, CreatePayload, { id: string }>,
	res: Response
) => {
	try {
		const { id } = req.query;
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

		let hashedPassword = undefined;

		if (password) {
			hashedPassword = await bcrypt.hash(password, 10);
		}

		await db
			.update(usersTable)
			.set({
				fullName,
				username,
				password: hashedPassword,
				email,
				phone,
				countryId,
				regionId,
				districtId,
				updatedAt: new Date(),
			})
			.where(eq(usersTable.id, Number(id)))
			.returning();

		await db
			.delete(usersRolesTable)
			.where(eq(usersRolesTable.userId, Number(id)));

		const userRoles = roles.map((roleId) => ({
			userId: Number(id),
			roleId: roleId,
		}));

		await db.insert(usersRolesTable).values(userRoles);

		res.json({ message: 'User updated successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
