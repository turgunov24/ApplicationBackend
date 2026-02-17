import { Request, Response } from 'express';
import db from '../../../db';
import { usersTable } from '../../../db/schemas/users';
import { eq } from 'drizzle-orm';
import { handleError } from '../../../utils/handleError';
import { generateErrorMessage } from '../../../utils/generateErrorMessage';

/**
 * @swagger
 * /api/core/auth/get-user-permissions:
 *   get:
 *     summary: Get current user's permissions
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User permissions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 permissions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       action:
 *                         type: string
 *                       resource:
 *                         type: string
 *       401:
 *         description: Unauthorized
 */
export const getUserPermissionsHandler = async (
	req: Request,
	res: Response,
) => {
	try {
		// Get user ID from the authenticated request (set by parseUserFromToken middleware)
		const userId = req.user?.id;

		if (!userId) {
			return res.status(401).json(generateErrorMessage('Unauthorized'));
		}

		const user = await db.query.usersTable.findFirst({
			where: eq(usersTable.id, userId),
			with: {
				userRoles: {
					with: {
						role: {
							with: {
								rolesPermissions: {
									with: {
										permission: {
											columns: {
												action: true,
												resource: true,
											},
										},
									},
								},
							},
						},
					},
				},
			},
		});

		if (!user) {
			return res.status(404).json(generateErrorMessage('User not found'));
		}

		const permissions = user.userRoles.map(({ role }) =>
			role.rolesPermissions.map(({ permission }) => ({
				action: permission.action,
				resource: permission.resource,
			})),
		);

		return res.status(200).json({
			permissions: permissions.flat(),
		});
	} catch (error: unknown) {
		handleError(res, error);
	}
};
