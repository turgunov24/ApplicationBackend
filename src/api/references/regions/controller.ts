import { Router } from 'express';
import {
	createValidator,
	deleteValidator,
	indexValidator,
	listValidator,
	updateValidator,
} from './validators';
import { withValidationErrorsMiddleware } from '../../../middlewares/withValidationErrors';
import { indexHandler } from './handlers';
import { createHandler } from './handlers/create';
import { updateHandler } from './handlers/update';
import { deleteHandler } from './handlers/delete';
import { getCountsByStatusHandler } from './handlers/getCountsByStatus';
import { listHandler } from './handlers/list';
import { parseUserFromToken } from '../../../middlewares/parseUserFromToken';
import { authorizeUser } from '../../../middlewares/authorizeUser';

const router = Router();

// @ts-expect-error
router.get('/', parseUserFromToken, authorizeUser, indexValidator, withValidationErrorsMiddleware, indexHandler);
router.get('/counts-by-status', parseUserFromToken, authorizeUser, getCountsByStatusHandler);
// @ts-expect-error
router.get('/list', parseUserFromToken, authorizeUser, listValidator, withValidationErrorsMiddleware, listHandler);
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
