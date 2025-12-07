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

router.use(parseUserFromToken, authorizeUser);
router.get(
	'/',
	indexValidator,
	withValidationErrorsMiddleware,
	// @ts-expect-error
	indexHandler
);

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

router.get('/counts-by-status', getCountsByStatusHandler);
router.get(
	'/list',
	listValidator,
	withValidationErrorsMiddleware,
	// @ts-expect-error
	listHandler
);

export default router;
