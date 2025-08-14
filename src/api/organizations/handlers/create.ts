import db from '../../../db';
import {
	OrganizationInsert,
	organizationsTable,
} from '../../../db/schemas/organizations';
import { Request, Response } from 'express';

export const createHandler = async (
	req: Request<{}, {}, OrganizationInsert>,
	res: Response
) => {
	try {
		const { name } = req.body;

		const result = await db
			.insert(organizationsTable)
			.values({ name, token: 'sdf' })
			.returning();
		res.status(201).json(result[0]);
	} catch (error) {
		res.status(500).json({ message: 'Failed to create district' });
	}
};
