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
