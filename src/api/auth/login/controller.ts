import { Router } from 'express';
import { loginHandler } from './handlers';
import { loginValidator } from './validator';
import { withValidationErrorsMiddleware } from '../../../middlewares/withValidationErrors';

const router = Router();

router.post(
	'/login',
	loginValidator,
	withValidationErrorsMiddleware,
	loginHandler
);

export default router;
