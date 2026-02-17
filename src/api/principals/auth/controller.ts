import { Router } from 'express';
import { principalLoginHandler } from './handlers';
import { principalLoginValidator } from './validator';
import { withValidationErrorsMiddleware } from '../../../middlewares/withValidationErrors';

const router = Router();

router.post(
	'/login',
	principalLoginValidator,
	withValidationErrorsMiddleware,
	principalLoginHandler,
);

export default router;
