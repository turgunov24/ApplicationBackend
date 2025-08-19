import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { generateErrorMessage } from '../utils/generateErrorMessage';

export const withValidationErrorsMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const errors = validationResult(req);

	if (errors.isEmpty()) {
		return next();
	} else {
		res
			.status(400)
			.json(generateErrorMessage(errors.array().map((error) => error.msg)));
	}
};
