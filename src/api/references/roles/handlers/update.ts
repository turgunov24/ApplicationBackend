import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { CreatePayload } from '../validators';
import { referencesRolesTable } from '../../../../db/schemas/references/roles';
import db from '../../../../db';
import { handleError } from '../../../../utils/handleError';

export const updateHandler = async (
	req: Request<{}, {}, CreatePayload, { id: string }>,
	res: Response
) => {
	try {
		const { id } = req.query;
		const { nameUz, nameRu, descriptionUz, descriptionRu } = req.body;

		await db
			.update(referencesRolesTable)
			.set({
				nameUz,
				nameRu,
				descriptionUz,
				descriptionRu,
				updatedAt: new Date(),
			})
			.where(eq(referencesRolesTable.id, Number(id)))
			.returning();

		res.json({ message: 'Role updated successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
