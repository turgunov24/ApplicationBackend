import { Request, Response } from 'express';
import db from '../../../../db';
import { referencesPermissionsTable } from '../../../../db/schemas';
import { handleError } from '../../../../utils/handleError';
import { and, asc, eq, ne } from 'drizzle-orm';
import { ListValidationSchema } from '../validators';
import { getAuthUserId } from '../../../../utils/getAuthUserId';
import { generateErrorMessage } from '../../../../utils/generateErrorMessage';
import { SUPER_ADMIN_ID } from '../../../../helpers/config';

/**
 * @swagger
 * /api/references/permissions/list:
 *   get:
 *     summary: Get non-deleted permissions (id, nameUz, nameRu, permissionGroupId)
 *     tags: [References - Permissions]
 *     parameters:
 *       - in: query
 *         name: permissionGroupId
 *         schema:
 *           type: string
 *         description: Filter permissions by permission group ID
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nameUz:
 *                     type: string
 *                   nameRu:
 *                     type: string
 *                   permissionGroupId:
 *                     type: integer
 *       400:
 *         description: Bad request
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

interface QueryParams {
	[key: string]: string | undefined;
	permissionGroupId?: string;
}

export const listHandler = async (
	req: Request<{}, {}, {}, QueryParams>,
	res: Response,
) => {
	try {
		const { permissionGroupId } = req.query;

		const userId = getAuthUserId(req);

		if (!userId)
			return res.status(401).json(generateErrorMessage('Unauthorized'));

		const whereConditions = [ne(referencesPermissionsTable.status, 'deleted')];

		if (userId !== SUPER_ADMIN_ID) {
			whereConditions.push(eq(referencesPermissionsTable.createdBy, userId));
		}

		if (permissionGroupId) {
			whereConditions.push(
				eq(
					referencesPermissionsTable.permissionGroupId,
					Number(permissionGroupId),
				),
			);
		}

		const permissions = await db.query.referencesPermissionsTable.findMany({
			where: and(...whereConditions),
			orderBy: asc(referencesPermissionsTable.createdAt),
			columns: {
				id: true,
				nameUz: true,
				nameRu: true,
				permissionGroupId: true,
			},
		});
		res.json(permissions);
	} catch (error) {
		handleError(res, error);
	}
};
