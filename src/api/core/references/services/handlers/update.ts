import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { CreatePayload } from '../validators';
import { referencesServicesTable } from '../../../../../db/schemas/references/services';
import db from '../../../../../db';
import { handleError } from '../../../../../utils/handleError';

export const updateHandler = async (
	req: Request<{}, {}, CreatePayload, { id: string }>,
	res: Response,
) => {
	try {
		const { id } = req.query;
		const { name } = req.body;

		await db
			.update(referencesServicesTable)
			.set({
				name,
				updatedAt: new Date(),
			})
			.where(eq(referencesServicesTable.id, Number(id)))
			.returning();

		res.json({ message: 'Service updated successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
