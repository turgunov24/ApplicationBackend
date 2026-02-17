import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { CreatePayload } from '../validators';
import { referencesClientTypesTable } from '../../../../../db/schemas/references/clientTypes';
import db from '../../../../../db';
import { handleError } from '../../../../../utils/handleError';

export const updateHandler = async (
	req: Request<{}, {}, CreatePayload, { id: string }>,
	res: Response,
) => {
	try {
		const { id } = req.query;
		const { nameUz, nameRu } = req.body;

		await db
			.update(referencesClientTypesTable)
			.set({
				nameUz,
				nameRu,
				updatedAt: new Date(),
			})
			.where(eq(referencesClientTypesTable.id, Number(id)))
			.returning();

		res.json({ message: 'Client type updated successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
