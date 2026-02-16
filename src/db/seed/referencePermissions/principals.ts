import { InferSelectModel } from 'drizzle-orm';
import { referencesPermissionsTable } from '../../schemas';
import { PRINCIPALS_CONTROLLER } from '../../../helpers/endPoints';
import { ResourceActions } from '../../../types/auth';

export const principalsPermissions: Array<
	Pick<
		InferSelectModel<typeof referencesPermissionsTable>,
		'nameRu' | 'nameUz' | 'resource' | 'action'
	>
> = [
	{
		nameUz: 'principals-index',
		nameRu: 'principals-index',
		resource: PRINCIPALS_CONTROLLER,
		action: ResourceActions.READ,
	},
	{
		nameUz: 'principals-create',
		nameRu: 'principals-create',
		resource: PRINCIPALS_CONTROLLER,
		action: ResourceActions.CREATE,
	},
	{
		nameUz: 'principals-update',
		nameRu: 'principals-update',
		resource: PRINCIPALS_CONTROLLER,
		action: ResourceActions.UPDATE,
	},
	{
		nameUz: 'principals-delete',
		nameRu: 'principals-delete',
		resource: PRINCIPALS_CONTROLLER,
		action: ResourceActions.DELETE,
	},
	{
		nameUz: 'principals-counts-by-status',
		nameRu: 'principals-counts-by-status',
		resource: PRINCIPALS_CONTROLLER.concat('/counts-by-status'),
		action: ResourceActions.READ,
	},
	{
		nameUz: 'principals-avatar',
		nameRu: 'principals-avatar',
		resource: PRINCIPALS_CONTROLLER.concat('/avatar'),
		action: ResourceActions.UPDATE,
	},
];
