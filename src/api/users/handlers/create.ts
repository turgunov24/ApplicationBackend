import db from '../../../db';
import { usersTable } from '../../../db/schemas/users';
import { Request, Response } from 'express';
import { CreatePayload } from '../validators';
import bcrypt from 'bcryptjs';

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
			roleId,
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
				roleId,
				avatarPath,
			})
			.returning();

		res.status(201).json(result[0]);
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({ message: error.cause });
		} else {
			res.status(500).json({ message: 'Internal server error' });
		}
		console.log(error);
	}
};
