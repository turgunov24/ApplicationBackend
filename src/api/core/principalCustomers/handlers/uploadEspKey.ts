import db from '../../../../db';
import { principalCustomersTable } from '../../../../db/schemas/principalCustomers';
import { Request, Response } from 'express';
import { handleError } from '../../../../utils/handleError';
import { eq } from 'drizzle-orm';
import { generateErrorMessage } from '../../../../utils/generateErrorMessage';

export const uploadEspKeyHandler = async (
	req: Request<{}, {}, {}, { id: string }>,
	res: Response
) => {
	try {
		const { id } = req.query;

		if (req.file) {
			if (req.file.path) {
				await db
					.update(principalCustomersTable)
					.set({
						espPath: req.file.path,
					})
					.where(eq(principalCustomersTable.id, Number(id)));

				return res
					.status(201)
					.json({ message: 'ESP Key uploaded successfully' });
			}
		}

		return res.status(400).json(generateErrorMessage('ESP Key upload failed'));
	} catch (error) {
		handleError(res, error);
	}
};
