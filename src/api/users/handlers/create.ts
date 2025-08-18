import db from '../../../db';
import { usersTable } from '../../../db/schemas/users';
import { Request, Response } from 'express';
import { CreatePayload } from '../validators';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import multer from 'multer';
import path from 'path';



export const createHandler = async (
	req: Request<{}, {}, CreatePayload>,
	res: Response
) => {
	try {
		const { name, username, password } = req.body;
		console.log('🚀 ~ createHandler ~ req:', req.file);
		// const hashedPassword = await bcrypt.hash(password, 10);

		// const result = await db
		// 	.insert(usersTable)
		// 	.values({
		// 		name,
		// 		username,
		// 		password: hashedPassword,
		// 	})
		// 	.returning();
		// res.status(201).json(result[0]);
		res.status(201).json({ message: 'User created successfully' });
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({ message: error.message });
		} else {
			res.status(500).json({ message: 'Internal server error' });
		}
		console.log(error);
	}
};
