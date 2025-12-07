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
 * /api/users:
 *   put:
 *     summary: Update an existing user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - username
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
 *                 description: Optional - only provide if changing password
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
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
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
 *       404:
 *         description: User not found
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
		}

		const user = await db
			.update(usersTable)
			.set({
				fullName,
				username,
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

		res.json({ message: 'User updated successfully', id: user[0].id });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
