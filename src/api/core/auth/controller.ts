import { Router } from 'express';
import { loginHandler } from './handlers';
import { loginValidator } from './validator';
import { withValidationErrorsMiddleware } from '../../../middlewares/withValidationErrors';
import { getUserPermissionsHandler } from './getUserPermissionsHandler';
import { parseUserFromToken } from '../../../middlewares/parseUserFromToken';

const router = Router();

router.post(
	'/login',
	loginValidator,
	withValidationErrorsMiddleware,
	loginHandler,
);

router.get(
	'/get-user-permissions',
	parseUserFromToken,
	// authorizeUser,
	getUserPermissionsHandler,
);

export default router;
