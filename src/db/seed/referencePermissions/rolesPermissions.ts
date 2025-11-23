import { InferSelectModel } from 'drizzle-orm';
import { referencesPermissionsTable } from '../../schemas';
import { REFERENCES_ROLES_PERMISSIONS_CONTROLLER } from '../../../helpers/endPoints';
import { ResourceActions } from '../../../types/auth';

export const rolesPermissionsPermissions: Array<
	Pick<
		InferSelectModel<typeof referencesPermissionsTable>,
		'nameRu' | 'nameUz' | 'resource' | 'action'
	>
> = [
	{
		nameUz: 'reference-roles-permissions-index',
		nameRu: 'reference-roles-permissions-index',
		resource: REFERENCES_ROLES_PERMISSIONS_CONTROLLER,
		action: ResourceActions.READ,
	},
	{
		nameUz: 'reference-roles-permissions-update',
		nameRu: 'reference-roles-permissions-update',
		resource: REFERENCES_ROLES_PERMISSIONS_CONTROLLER,
		action: ResourceActions.UPDATE,
	},
];
