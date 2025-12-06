import { Request, Response } from 'express';
import { CreatePayload } from '../validators';
import { referencesPermissionsTable } from '../../../../db/schemas/references/permissions';
import db from '../../../../db';
import { handleError } from '../../../../utils/handleError';

/**
 * @swagger
 * /api/references/permissions/create:
 *   post:
 *     summary: Create a new permission
 *     tags: [References - Permissions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nameUz
 *               - nameRu
 *               - permissionGroupId
 *               - resource
 *               - action
 *             properties:
 *               nameUz:
 *                 type: string
 *                 description: Permission name in Uzbek
 *               nameRu:
 *                 type: string
 *                 description: Permission name in Russian
 *               permissionGroupId:
 *                 type: integer
 *                 description: Permission group ID
 *               resource:
 *                 type: string
 *                 description: Resource name
 *               action:
 *                 type: string
 *                 description: Action name
 *     responses:
 *       201:
 *         description: Permission created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nameUz:
 *                   type: string
 *                 nameRu:
 *                   type: string
 *                 permissionGroupId:
 *                   type: integer
 *                 resource:
 *                   type: string
 *                 action:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 status:
 *                   type: string
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

export const createHandler = async (
	req: Request<{}, {}, CreatePayload>,
	res: Response
) => {
	try {
		const { nameUz, nameRu, permissionGroupId, resource, action } = req.body;

		const result = await db
			.insert(referencesPermissionsTable)
			.values({
				resource,
				action,
				nameUz,
				nameRu,
				permissionGroupId,
			})
			.returning();

		res.status(201).json(result[0]);
	} catch (error) {
		handleError(res, error);
	}
};
