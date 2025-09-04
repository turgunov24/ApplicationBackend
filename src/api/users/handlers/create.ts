import db from '../../../db';
import { usersTable } from '../../../db/schemas/users';
import { usersRolesTable } from '../../../db/schemas/usersRoles';
import { Request, Response } from 'express';
import { CreatePayload } from '../validators';
import bcrypt from 'bcryptjs';
import { handleError } from '../../../utils/handleError';

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
			cityId,
			roles,
		} = req.body;

		const hashedPassword = await bcrypt.hash(password, 10);

		// Get avatar path from uploaded file, or null if no file uploaded
		const avatarPath = req.file
			? req.file.path
			: 'uploads/avatars/default-avatar.jpg';

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
				cityId,
				avatarPath,
			})
			.returning();

		const newUser = result[0];

		if (roles && roles.length > 0) {
			const userRoles = roles.map((roleId) => ({
				userId: newUser.id,
				roleId: roleId,
			}));

			await db.insert(usersRolesTable).values(userRoles);
		}

		res.status(201).json(newUser);
	} catch (error) {
		handleError(res, error);
	}
};
