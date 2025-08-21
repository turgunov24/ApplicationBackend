import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { CreatePayload } from '../validators';
import { referencesDistrictsTable } from '../../../../db/schemas/references/districts';
import db from '../../../../db';
import { handleError } from '../../../../utils/handleError';

export const updateHandler = async (
	req: Request<{}, {}, CreatePayload, { id: string }>,
	res: Response
) => {
	try {
		const { id } = req.query;
		const { nameUz, nameRu, regionId } = req.body;

		await db
			.update(referencesDistrictsTable)
			.set({
				nameUz,
				nameRu,
				regionId,
				updatedAt: new Date(),
			})
			.where(eq(referencesDistrictsTable.id, Number(id)))
			.returning();

		res.json({ message: 'District updated successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
