import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import db from '../../../../db';
import { principalsTable } from '../../../../db/schemas/principals';
import { CreatePayload } from '../validators';
import { handleError } from '../../../../utils/handleError';

export const updateHandler = async (
	req: Request<{}, {}, CreatePayload, { id: string }>,
	res: Response,
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
		} = req.body;

		let hashedPassword = undefined;

		if (password) {
			hashedPassword = await bcrypt.hash(password, 10);

			await db
				.update(principalsTable)
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
				.where(eq(principalsTable.id, Number(id)));
		}

		const principal = await db
			.update(principalsTable)
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
			.where(eq(principalsTable.id, Number(id)))
			.returning();

		res.json({ message: 'User updated successfully', id: principal[0].id });
	} catch (error) {
		handleError(res, error);
	}
};
