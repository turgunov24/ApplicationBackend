import { Router } from 'express';
import { updateRolePermissionsValidator } from './validators';
import { withValidationErrorsMiddleware } from '../../../middlewares/withValidationErrors';
import { getRolePermissionsHandler } from './handlers/getRolePermissions';
import { updateRolePermissionsHandler } from './handlers/updateRolePermissions';

const router = Router();

router.get('/', getRolePermissionsHandler);
router.put(
	'/',
	updateRolePermissionsValidator,
	withValidationErrorsMiddleware,
	updateRolePermissionsHandler
);

export default router;
