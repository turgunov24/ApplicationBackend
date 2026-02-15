import { NextFunction, Request, Response, Router } from 'express';
import { indexHandler } from './handlers';
import { createHandler } from './handlers/create';
import { deleteHandler } from './handlers/delete';
import {
	createValidator,
	deleteValidator,
	indexValidator,
	updateValidator,
	uploadAvatarValidator,
} from './validators';
import { updateHandler } from './handlers/update';
import { getCountsByStatusHandler } from './handlers/getCountsByStatus';
import upload from './handlers/multer';
import { validationResult } from 'express-validator';
import fs from 'fs';
import { MulterError } from 'multer';
import { withValidationErrorsMiddleware } from '../../middlewares/withValidationErrors';
import { parseUserFromToken } from '../../middlewares/parseUserFromToken';
import { uploadAvatarHandler } from './handlers/uploadAvatar';
import { authorizeUser } from '../../middlewares/authorizeUser';

export const validationErrorHandler = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const errors = validationResult(req);

	if (errors.isEmpty()) {
		return next();
	} else {
		if (req.file) {
			fs.unlink(req.file.path, (err) => {
				if (err) console.error('Error deleting uploaded file:', err);
			});
		}
		res.status(400).json({
			errors: errors.array(),
		});
	}
};

export const multerErrorHandler = (
	error: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (error instanceof MulterError) {
		if (error.code === 'LIMIT_FILE_SIZE') {
			return res.status(400).json({
				error: 'File size too large. Maximum size is 5MB.',
			});
		}
		if (error.code === 'LIMIT_UNEXPECTED_FILE') {
			return res.status(400).json({
				error:
					'Unexpected field. Please use "file" as the field name for file uploads.',
			});
		}
		return res.status(400).json({
			error: 'File upload error: ' + error.message,
		});
	}

	// Handle other file-related errors
	if (error.message) {
		return res.status(400).json({
			error: error.message,
		});
	}

	next(error);
};

export const validateFileRequired = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (!req.file) {
		return res.status(400).json({
			error: 'File is required. Please upload an image file.',
		});
	}
	next();
};

const router = Router();

router.use(parseUserFromToken, authorizeUser);

router.get(
	'/',
	indexValidator,
	withValidationErrorsMiddleware,
	indexHandler
);

router.get('/counts-by-status', getCountsByStatusHandler);

router.post(
	'/',
	createValidator,
	withValidationErrorsMiddleware,
	createHandler
);

router.put('/', updateValidator, withValidationErrorsMiddleware, updateHandler);

router.put(
	'/upload-avatar',
	upload.single('file'),
	multerErrorHandler,
	validateFileRequired,
	uploadAvatarValidator,
	withValidationErrorsMiddleware,
	uploadAvatarHandler
);

router.delete(
	'/',
	deleteValidator,
	withValidationErrorsMiddleware,
	deleteHandler
);

export default router;
