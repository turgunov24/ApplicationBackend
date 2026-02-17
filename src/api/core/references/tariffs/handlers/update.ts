import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { CreatePayload } from '../validators';
import { referencesTariffsTable } from '../../../../../db/schemas/references/tariffs';
import db from '../../../../../db';
import { handleError } from '../../../../../utils/handleError';

export const updateHandler = async (
	req: Request<{}, {}, CreatePayload, { id: string }>,
	res: Response,
) => {
	try {
		const { id } = req.query;
		const { nameUz, nameRu, monthlyPrice, currencyId } = req.body;

		await db
			.update(referencesTariffsTable)
			.set({
				nameUz,
				nameRu,
				monthlyPrice,
				currencyId,
				updatedAt: new Date(),
			})
			.where(eq(referencesTariffsTable.id, Number(id)))
			.returning();

		res.json({ message: 'Tariff updated successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
