import { Router } from 'express';
import {
	indexValidator,
	changeStatusValidator,
} from './validators';
import { withValidationErrorsMiddleware } from '../../../../middlewares/withValidationErrors';
import { indexHandler } from './handlers';
import { changeStatusHandler } from './handlers/changeStatus';
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
	'/change-status',
	changeStatusValidator,
	withValidationErrorsMiddleware,
	changeStatusHandler,
);

export default router;
