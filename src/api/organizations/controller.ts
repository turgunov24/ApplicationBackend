import { Router } from 'express';
import { indexHandler } from './handlers';
import { withValidationErrorsMiddleware } from '../../middlewares/withValidationErrors';
import { createHandler } from './handlers/create';
import { createValidator } from './validators';

const router = Router();

router.get('/', indexHandler);
router.post(
	'/',
	createValidator,
	withValidationErrorsMiddleware,
	createHandler
);
// router.put('/', updateValidator, withValidationErrorsMiddleware, updateHandler);
// router.delete(
// 	'/',
// 	deleteValidator,
// 	withValidationErrorsMiddleware,
// 	deleteHandler
// );

export default router;
