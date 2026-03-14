import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { referencesLegalFormsTable } from '../../../../../db/schemas/references/legalForms';
import db from '../../../../../db';
import { handleError } from '../../../../../utils/handleError';

export const deleteHandler = async (
	req: Request<{}, {}, {}, { id: string }>,
	res: Response,
) => {
	try {
		const { id } = req.query;
		await db
			.update(referencesLegalFormsTable)
			.set({
				status: 'deleted',
				updatedAt: new Date(),
			})
			.where(eq(referencesLegalFormsTable.id, Number(id)))
			.returning();

		res.json({ message: 'Legal form deleted successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
