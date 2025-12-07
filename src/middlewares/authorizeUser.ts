import { NextFunction, Request, Response } from 'express';
import { handleError } from '../utils/handleError';
import db from '../db';
import { usersRolesTable } from '../db/schemas';
import { eq } from 'drizzle-orm';
import resources from '../policy/resources';
import { generateErrorMessage } from '../utils/generateErrorMessage';

export const authorizeUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		if (process.env.SKIP_AUTH === 'true') return next();

		const { user, baseUrl } = req;

		const resource = resources.find((r) => r.endpoint === baseUrl);

		if (!resource) {
			return res.status(400).json(generateErrorMessage('Resource not found'));
		}

		const result = await db.query.usersRolesTable.findMany({
			where: eq(usersRolesTable.userId, user.id),
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
		});

		const permissions = result.flatMap((r) =>
			r.role.rolesPermissions.map((rp) => rp.permission)
		);

		for (const permission of permissions) {
			if (!permission.action) continue;
			if (!permission.resource) continue;

			if (permission.resource !== resource.endpoint) continue;

			const granted = resource.allowedActions.some(
				(allowedAction) => permission.action === allowedAction
			);
			if (granted) {
				return next();
			}
		}
		return res.status(403).json(generateErrorMessage('Access denied'));
	} catch (error: unknown) {
		handleError(res, error);
	}
};
