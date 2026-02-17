import { Router } from 'express';
import { updateRolePermissionsValidator } from './validators';
import { withValidationErrorsMiddleware } from '../../../../middlewares/withValidationErrors';
import { getRolePermissionsHandler } from './handlers/getRolePermissions';
import { updateRolePermissionsHandler } from './handlers/updateRolePermissions';
import { authorizeUser } from '../../../../middlewares/authorizeUser';
import { parseUserFromToken } from '../../../../middlewares/parseUserFromToken';

const router = Router();

router.use(parseUserFromToken, authorizeUser);

router.get('/', getRolePermissionsHandler);
router.put(
	'/',
	updateRolePermissionsValidator,
	withValidationErrorsMiddleware,
	updateRolePermissionsHandler
);

export default router;
