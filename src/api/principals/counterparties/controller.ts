import { Router } from 'express';
import {
	createValidator,
	indexValidator,
	updateValidator,
} from './validators';
import { withValidationErrorsMiddleware } from '../../../middlewares/withValidationErrors';
import { indexHandler } from './handlers';
import { createHandler } from './handlers/create';
import { updateHandler } from './handlers/update';
import { getCountsByStatusHandler } from './handlers/getCountsByStatus';
import { listHandler } from './handlers/list';
import { parsePrincipalFromToken } from '../../../middlewares/parsePrincipalFromToken';

const router = Router();

router.use(parsePrincipalFromToken);

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

router.get('/list', listHandler);

router.get('/counts-by-status', getCountsByStatusHandler);

export default router;
