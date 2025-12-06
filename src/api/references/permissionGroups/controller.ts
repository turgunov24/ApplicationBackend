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
router.post(
	'/',
	parseUserFromToken,
	authorizeUser,
	createValidator,
	withValidationErrorsMiddleware,
	createHandler
);
router.put(
	'/',
	parseUserFromToken,
	authorizeUser,
	updateValidator,
	withValidationErrorsMiddleware,
	updateHandler
);
router.delete(
	'/',
	parseUserFromToken,
	authorizeUser,
	deleteValidator,
	withValidationErrorsMiddleware,
	deleteHandler
);
router.get('/list', parseUserFromToken, authorizeUser, listHandler);
router.get(
	'/counts-by-status',
	parseUserFromToken,
	authorizeUser,
	getCountsByStatusHandler
);

export default router;
