import { Request, Response } from 'express';
import db from '../../../db';
import { organizationsTable } from '../../../db/schemas/organizations';

export const indexHandler = async (req: Request, res: Response) => {
	try {
		const result = await db.select().from(organizationsTable);
		res.json(result);
	} catch (error) {
		res.status(500).json({ message: 'Failed to fetch organizations' });
	}
};
