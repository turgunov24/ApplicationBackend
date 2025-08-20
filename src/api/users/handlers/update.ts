import { Request, Response } from 'express';
import { usersTable } from '../../../db/schemas/users';
import db from '../../../db';
import { eq } from 'drizzle-orm';
import { CreatePayload } from '../validators';
import bcrypt from 'bcryptjs';
import { handleError } from '../../../utils/handleError';

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
			cityId,
			roleId,
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
				cityId,
				roleId,
				updatedAt: new Date(),
			})
			.where(eq(usersTable.id, Number(id)))
			.returning();

		res.json({ message: 'User updated successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
