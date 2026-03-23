import { Request, Response } from 'express';
import db from '../../../../db';
import { referencesCounterpartiesTable } from '../../../../db/schemas/references/counterparties';
import { handleError } from '../../../../utils/handleError';
import { asc, and, eq, ne } from 'drizzle-orm';
import { generateErrorMessage } from '../../../../utils/generateErrorMessage';

export const listHandler = async (req: Request, res: Response) => {
	try {
		const principal = req.principal;

		if (!principal)
			return res.status(401).json(generateErrorMessage('Unauthorized'));

		const whereConditions = [ne(referencesCounterpartiesTable.status, 'deleted')];

		// Bevosita principalId orqali filter
		whereConditions.push(eq(referencesCounterpartiesTable.principalId, principal.id));

		const counterparties = await db.query.referencesCounterpartiesTable.findMany({
			where: and(...whereConditions),
			orderBy: asc(referencesCounterpartiesTable.createdAt),
			columns: {
				id: true,
				name: true,
				phone: true,
			},
		});
		res.json(counterparties);
	} catch (error) {
		handleError(res, error);
	}
};
