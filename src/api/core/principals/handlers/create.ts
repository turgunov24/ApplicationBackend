import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import db from '../../../../db';
import { principalsTable } from '../../../../db/schemas/principals';
import { CreatePayload } from '../validators';
import { getAuthUserId } from '../../../../utils/getAuthUserId';
import { generateErrorMessage } from '../../../../utils/generateErrorMessage';
import { handleError } from '../../../../utils/handleError';

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
		} = req.body;

		const userId = getAuthUserId(req);

		if (!userId) {
			return res.status(401).json(generateErrorMessage('Unauthorized'));
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const result = await db
			.insert(principalsTable)
			.values({
				fullName,
				username,
				password: hashedPassword,
				email,
				phone,
				countryId,
				regionId,
				districtId,
				createdBy: userId,
				status: 'active',
			})
			.returning();

		const newPrincipal = result[0];

		res.status(201).json(newPrincipal);
	} catch (error) {
		handleError(res, error);
	}
};
