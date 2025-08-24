import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { CreatePayload } from '../validators';
import { referencesRegionsTable } from '../../../../db/schemas/references/regions';
import db from '../../../../db';
import { handleError } from '../../../../utils/handleError';

export const updateHandler = async (
	req: Request<{}, {}, CreatePayload, { id: string }>,
	res: Response
) => {
	try {
		const { id } = req.query;
		const { nameUz, nameRu ,countryId} = req.body;

		await db
			.update(referencesRegionsTable)
			.set({
				nameUz,
				nameRu,
				countryId,
				updatedAt: new Date(),
			})
			.where(eq(referencesRegionsTable.id, Number(id)))
			.returning();

		res.json({ message: 'Region updated successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
