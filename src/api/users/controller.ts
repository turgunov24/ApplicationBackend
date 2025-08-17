import { Router } from 'express';
import { indexHandler } from './handlers';
import { createHandler } from './handlers/create';
import { deleteHandler } from './handlers/delete';
import {
	createValidator,
	deleteValidator,
	updateValidator,
} from './validators';
import { withValidationErrorsMiddleware } from '../../middlewares/withValidationErrors';
import { updateHandler } from './handlers/update';
import { getCountsByStatusHandler } from './handlers/getCountsByStatus';

const router = Router();

router.get('/', indexHandler);
router.get('/counts-by-status', getCountsByStatusHandler);
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
