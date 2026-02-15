import { Request, Response } from 'express';

/**
 * Request dan authenticated user ID ni xavfsiz oladi.
 * Agar user topilmasa, 0(falsy) javob qaytaradi.
 *
 * @example
 * // Handler da ishlatish:
 * const userId = getAuthUserId(req);
 * if (!userId) return response.status(401).json(generateErrorMessage('Unauthorized'));
 *
 * @example
 * // Validator (express-validator custom options) da ishlatish:
 * const userId = getAuthUserId(req as Express.Request);
 */
export function getAuthUserId(req: Request): number {
	const userId = req.user?.id;

	if (!userId) {
		return 0;
	}

	return userId;
}
