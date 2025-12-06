import { InferSelectModel } from 'drizzle-orm';
import { referencesPermissionsTable } from '../../schemas';
import { USERS_CONTROLLER } from '../../../helpers/endPoints';
import { ResourceActions } from '../../../types/auth';

export const usersPermissions: Array<
	Pick<
		InferSelectModel<typeof referencesPermissionsTable>,
		'nameRu' | 'nameUz' | 'resource' | 'action'
	>
> = [
	{
		nameUz: 'users-index',
		nameRu: 'users-index',
		resource: USERS_CONTROLLER,
		action: ResourceActions.READ,
	},
	{
		nameUz: 'users-create',
		nameRu: 'users-create',
		resource: USERS_CONTROLLER,
		action: ResourceActions.CREATE,
	},
	{
		nameUz: 'users-update',
		nameRu: 'users-update',
		resource: USERS_CONTROLLER,
		action: ResourceActions.UPDATE,
	},
	{
		nameUz: 'users-delete',
		nameRu: 'users-delete',
		resource: USERS_CONTROLLER,
		action: ResourceActions.DELETE,
	},
	{
		nameUz: 'users-counts-by-status',
		nameRu: 'users-counts-by-status',
		resource: USERS_CONTROLLER.concat('/counts-by-status'),
		action: ResourceActions.READ,
	},
	{
		nameUz: 'users-avatar',
		nameRu: 'users-avatar',
		resource: USERS_CONTROLLER.concat('/avatar'),
		action: ResourceActions.UPDATE,
	}
];
