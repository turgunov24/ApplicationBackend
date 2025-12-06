import { Request, Response } from 'express';
import { usersTable } from '../../../db/schemas/users';
import db from '../../../db';
import { eq } from 'drizzle-orm';
import { CreatePayload } from '../validators';
import bcrypt from 'bcryptjs';
import { handleError } from '../../../utils/handleError';
import { usersRolesTable } from '../../../db/schemas';

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
