import db from '../../../../db';
import { usersTable } from '../../../../db/schemas/users';
import { Request, Response } from 'express';
import { handleError } from '../../../../utils/handleError';
import { eq } from 'drizzle-orm';
import { generateErrorMessage } from '../../../../utils/generateErrorMessage';

/**
 * @swagger
 * /api/users/upload-avatar:
 *   post:
 *     summary: Upload user avatar
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to upload avatar for
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Avatar image file
 *     responses:
 *       201:
 *         description: Avatar uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Avatar upload failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 */

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
