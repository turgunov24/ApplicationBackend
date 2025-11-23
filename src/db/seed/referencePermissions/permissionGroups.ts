import { InferSelectModel } from 'drizzle-orm';
import { referencesPermissionsTable } from '../../schemas';
import { REFERENCES_PERMISSION_GROUPS_CONTROLLER } from '../../../helpers/endPoints';
import { ResourceActions } from '../../../types/auth';

export const permissionGroupsPermissions: Array<
	Pick<
		InferSelectModel<typeof referencesPermissionsTable>,
		'nameRu' | 'nameUz' | 'resource' | 'action'
	>
> = [
	{
		nameUz: 'reference-permission-groups-index',
		nameRu: 'reference-permission-groups-index',
		resource: REFERENCES_PERMISSION_GROUPS_CONTROLLER,
		action: ResourceActions.READ,
	},
	{
		nameUz: 'reference-permission-groups-create',
		nameRu: 'reference-permission-groups-create',
		resource: REFERENCES_PERMISSION_GROUPS_CONTROLLER,
		action: ResourceActions.CREATE,
	},
	{
		nameUz: 'reference-permission-groups-update',
		nameRu: 'reference-permission-groups-update',
		resource: REFERENCES_PERMISSION_GROUPS_CONTROLLER,
		action: ResourceActions.UPDATE,
	},
	{
		nameUz: 'reference-permission-groups-delete',
		nameRu: 'reference-permission-groups-delete',
		resource: REFERENCES_PERMISSION_GROUPS_CONTROLLER,
		action: ResourceActions.DELETE,
	},
	{
		nameUz: 'reference-permission-groups-list',
		nameRu: 'reference-permission-groups-list',
		resource: REFERENCES_PERMISSION_GROUPS_CONTROLLER,
		action: ResourceActions.READ,
	},
	{
		nameUz: 'reference-permission-groups-counts-by-status',
		nameRu: 'reference-permission-groups-counts-by-status',
		resource: REFERENCES_PERMISSION_GROUPS_CONTROLLER,
		action: ResourceActions.READ,
	},
];
