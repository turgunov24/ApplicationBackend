import { Router } from 'express';
import {
	createValidator,
	deleteValidator,
	indexValidator,
	updateValidator,
	uploadEspKeyValidator,
	deleteEspKeyValidator,
} from './validators';
import { withValidationErrorsMiddleware } from '../../../middlewares/withValidationErrors';
import { indexHandler } from './handlers';
import { createHandler } from './handlers/create';
import { updateHandler } from './handlers/update';
import { deleteHandler } from './handlers/delete';
import { getCountsByStatusHandler } from './handlers/getCountsByStatus';
import { listHandler } from './handlers/list';
import uploadEspKey from './handlers/multer';
import { uploadEspKeyHandler } from './handlers/uploadEspKey';
import { deleteEspKeyHandler } from './handlers/deleteEspKey';
import { parseUserFromToken } from '../../../middlewares/parseUserFromToken';
import { authorizeUser } from '../../../middlewares/authorizeUser';
import { multerErrorHandler, validateFileRequired } from '../users/controller';

const router = Router();

router.use(parseUserFromToken, authorizeUser);

router.get('/', indexValidator, withValidationErrorsMiddleware, indexHandler);

router.post(
	'/',
	createValidator,
	withValidationErrorsMiddleware,
	createHandler,
);

router.put('/', updateValidator, withValidationErrorsMiddleware, updateHandler);

router.put(
	'/upload-esp-key',
	uploadEspKey.single('file'),
	multerErrorHandler,
	validateFileRequired,
	uploadEspKeyValidator,
	withValidationErrorsMiddleware,
	uploadEspKeyHandler,
);

router.delete(
	'/delete-esp-key',
	deleteEspKeyValidator,
	withValidationErrorsMiddleware,
	deleteEspKeyHandler,
);

router.delete(
	'/',
	deleteValidator,
	withValidationErrorsMiddleware,
	deleteHandler,
);

router.get('/list', listHandler);

router.get('/counts-by-status', getCountsByStatusHandler);

export default router;
