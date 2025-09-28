import { Router } from 'express'
import {
	createValidator,
	deleteValidator,
	indexValidator,
	updateValidator,
} from './validators'
import { withValidationErrorsMiddleware } from '../../../middlewares/withValidationErrors'
import { indexHandler } from './handlers'
import { createHandler } from './handlers/create'
import { updateHandler } from './handlers/update'
import { deleteHandler } from './handlers/delete'
import { getCountsByStatusHandler } from './handlers/getCountsByStatus'
import { listHandler } from './handlers/list'
import { parseUserFromToken } from '../../../middlewares/parseUserFromToken'
import { authorizeUser } from '../../../middlewares/authorizeUser'

const router = Router();

router.get(
	'/',
	parseUserFromToken,
	authorizeUser,
	indexValidator,
	withValidationErrorsMiddleware,
	// @ts-expect-error
	indexHandler
);

router.get('/list', parseUserFromToken, listHandler);

router.get('/counts-by-status', parseUserFromToken, getCountsByStatusHandler);

router.post(
	'/',
	parseUserFromToken,
	createValidator,
	withValidationErrorsMiddleware,
	createHandler
);

router.put(
	'/',
	parseUserFromToken,
	updateValidator,
	withValidationErrorsMiddleware,
	updateHandler
);

router.delete(
	'/',
	parseUserFromToken,
	deleteValidator,
	withValidationErrorsMiddleware,
	deleteHandler
);

export default router;
