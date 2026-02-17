import { Request, Response } from 'express';
import { handleError } from '../../../../../utils/handleError';
import resources from '../../../../../policy/resources';

/**
 * @swagger
 * /api/references/resources:
 *   get:
 *     summary: Get all available resources
 *     tags: [References - Resources]
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
 *                   name:
 *                     type: string
 *                     description: Resource name identifier
 *                   endpoint:
 *                     type: string
 *                     description: API endpoint path
 *                   allowedActions:
 *                     type: array
 *                     items:
 *                       type: string
 *                       enum: [create, update, read, delete]
 *                     description: List of allowed actions for this resource
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

export const indexHandler = async (req: Request, res: Response) => {
	try {
		res.json(resources);
	} catch (error: unknown) {
		handleError(res, error);
	}
};
