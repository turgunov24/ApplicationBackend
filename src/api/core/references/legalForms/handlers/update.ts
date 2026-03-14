import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { CreatePayload } from '../validators';
import { referencesLegalFormsTable } from '../../../../../db/schemas/references/legalForms';
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
			.update(referencesLegalFormsTable)
			.set({
				name,
				updatedAt: new Date(),
			})
			.where(eq(referencesLegalFormsTable.id, Number(id)))
			.returning();

		res.json({ message: 'Legal form updated successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
