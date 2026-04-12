import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { CreatePayload } from '../validators';
import { referencesAttachTemplateToTaskTable } from '../../../../../db/schemas/references/attachTemplateToTask';
import db from '../../../../../db';
import { handleError } from '../../../../../utils/handleError';
import { getAuthUserId } from '../../../../../utils/getAuthUserId';
import { generateErrorMessage } from '../../../../../utils/generateErrorMessage';

export const updateHandler = async (
	req: Request<{}, {}, CreatePayload, { id: string }>,
	res: Response,
) => {
	try {
		const userId = getAuthUserId(req);

		if (!userId)
			return res.status(401).json(generateErrorMessage('Unauthorized'));

		const { id } = req.query;
		const { principalCustomerId, taskTemplateIds, startDate, endDate } =
			req.body;

		await db.transaction(async (tx) => {
			const [first, ...rest] = taskTemplateIds;

			// Update the existing record
			await tx
				.update(referencesAttachTemplateToTaskTable)
				.set({
					principalCustomerId,
					taskTemplateId: first,
					startDate: startDate ? new Date(startDate) : undefined,
					endDate: endDate ? new Date(endDate) : undefined,
					updatedAt: new Date(),
				})
				.where(eq(referencesAttachTemplateToTaskTable.id, Number(id)));

			// If there are more template IDs, create new records for them
			if (rest.length > 0) {
				const insertValues = rest.map((tId) => ({
					createdBy: userId,
					principalCustomerId,
					taskTemplateId: tId,
					startDate: startDate ? new Date(startDate) : undefined,
					endDate: endDate ? new Date(endDate) : undefined,
				}));

				await tx
					.insert(referencesAttachTemplateToTaskTable)
					.values(insertValues);
			}
		});

		res.json({ message: 'Attach template to task updated successfully' });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
