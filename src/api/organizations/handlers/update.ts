import { Request, Response } from 'express';
import { organizationsTable } from '../../../db/schemas/organizations';
import db from '../../../db';
import { eq } from 'drizzle-orm';

export const updateHandler = async (req: Request, res: Response) => {
	try {
		const { id } = req.query;
		const { name } = req.body;

		await db
			.update(organizationsTable)
			.set({ name, updatedAt: new Date() })
			.where(eq(organizationsTable.id, Number(id)))
			.returning();

		res.json({ message: 'District updated successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Failed to update district' });
	}
};
