import { Router } from 'express';
import {
	createValidator,
	deleteValidator,
	indexValidator,
	updateValidator,
} from './validators';
import { withValidationErrorsMiddleware } from '../../../../middlewares/withValidationErrors';
import { indexHandler } from './handlers';
import { createHandler } from './handlers/create';
import { updateHandler } from './handlers/update';
import { deleteHandler } from './handlers/delete';
import { getCountsByStatusHandler } from './handlers/getCountsByStatus';
import { listHandler } from './handlers/list';
import { bundleHandler } from './handlers/bundle';
import { parseUserFromToken } from '../../../../middlewares/parseUserFromToken';
import { authorizeUser } from '../../../../middlewares/authorizeUser';

const router = Router();

router.use(parseUserFromToken, authorizeUser);

router.get(
	'/',
	indexValidator,
	withValidationErrorsMiddleware,
	indexHandler,
);

router.post(
	'/',
	createValidator,
	withValidationErrorsMiddleware,
	createHandler,
);

router.put('/', updateValidator, withValidationErrorsMiddleware, updateHandler);

router.delete(
	'/',
	deleteValidator,
	withValidationErrorsMiddleware,
	deleteHandler,
);

router.get('/list', listHandler);

router.get('/counts-by-status', getCountsByStatusHandler);

router.get('/bundle/:lang', bundleHandler);

export default router;
