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
import { getCountsByStatusHandler } from './handlers/getCountsByStatus';
import { listHandler } from './handlers/list';
import { parseUserFromToken } from '../../../middlewares/parseUserFromToken';
import { checkAnyResourcePermission } from '../../../middlewares/checkPermission';
import { PolicyResources, PolicyActions } from '../../../policy/types';

const router = Router();

router.get(
	'/',
	parseUserFromToken,
	checkAnyResourcePermission(PolicyResources.COUNTRIES, PolicyActions.READ),
	indexValidator,
	withValidationErrorsMiddleware,
	// @ts-expect-error
	indexHandler
);

router.get(
	'/list',
	parseUserFromToken,
	checkAnyResourcePermission(PolicyResources.COUNTRIES, PolicyActions.READ),
	listHandler
);

router.get(
	'/counts-by-status',
	parseUserFromToken,
	checkAnyResourcePermission(PolicyResources.COUNTRIES, PolicyActions.READ),
	getCountsByStatusHandler
);

router.post(
	'/',
	parseUserFromToken,
	checkAnyResourcePermission(PolicyResources.COUNTRIES, PolicyActions.CREATE),
	createValidator,
	withValidationErrorsMiddleware,
	createHandler
);

router.put(
	'/',
	parseUserFromToken,
	checkAnyResourcePermission(PolicyResources.COUNTRIES, PolicyActions.UPDATE),
	updateValidator,
	withValidationErrorsMiddleware,
	updateHandler
);

router.delete(
	'/',
	parseUserFromToken,
	checkAnyResourcePermission(PolicyResources.COUNTRIES, PolicyActions.DELETE),
	deleteValidator,
	withValidationErrorsMiddleware,
	deleteHandler
);

export default router;
