import db from '../../../db'
import { usersTable } from '../../../db/schemas/users'
import { Request, Response } from 'express'
import { handleError } from '../../../utils/handleError'
import { eq } from 'drizzle-orm'
import { generateErrorMessage } from '../../../utils/generateErrorMessage'

export const uploadAvatarHandler = async (
	req: Request<{}, {}, {}, { id: string }>,
	res: Response
) => {
	try {
		const { id } = req.query;

		if (req.file) {
			if (req.file.path) {
				await db
					.update(usersTable)
					.set({
						avatarPath: req.file.path,
					})
					.where(eq(usersTable.id, Number(id)));
				return res
					.status(201)
					.json({ message: 'Avatar uploaded successfully' });
			}
		}
		return res.status(400).json(generateErrorMessage('Avatar upload failed'));
	} catch (error) {
		handleError(res, error);
	}
};
