import { Router } from 'express';
import {
	createValidator,
	deleteValidator,
	indexValidator,
	updateValidator,
} from './validators';
import { withValidationErrorsMiddleware } from '../../../middlewares/withValidationErrors';
import { indexHandler } from './handlers';
import { createHandler } from './handlers/create';
import { updateHandler } from './handlers/update';
import { deleteHandler } from './handlers/delete';

const router = Router();

// @ts-expect-error
router.get('/', indexValidator, withValidationErrorsMiddleware, indexHandler);
router.post(
	'/',
	createValidator,
	withValidationErrorsMiddleware,
	createHandler
);
router.put('/', updateValidator, withValidationErrorsMiddleware, updateHandler);
router.delete(
	'/',
	deleteValidator,
	withValidationErrorsMiddleware,
	deleteHandler
);

export default router;
