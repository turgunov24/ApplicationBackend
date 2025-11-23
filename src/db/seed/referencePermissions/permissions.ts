import { InferSelectModel } from 'drizzle-orm';
import { referencesPermissionsTable } from '../../schemas';
import { REFERENCES_PERMISSIONS_CONTROLLER } from '../../../helpers/endPoints';
import { ResourceActions } from '../../../types/auth';

export const permissionsPermissions: Array<
	Pick<
		InferSelectModel<typeof referencesPermissionsTable>,
		'nameRu' | 'nameUz' | 'resource' | 'action'
	>
> = [
	{
		nameUz: 'reference-permissions-index',
		nameRu: 'reference-permissions-index',
		resource: REFERENCES_PERMISSIONS_CONTROLLER,
		action: ResourceActions.READ,
	},
	{
		nameUz: 'reference-permissions-create',
		nameRu: 'reference-permissions-create',
		resource: REFERENCES_PERMISSIONS_CONTROLLER,
		action: ResourceActions.CREATE,
	},
	{
		nameUz: 'reference-permissions-update',
		nameRu: 'reference-permissions-update',
		resource: REFERENCES_PERMISSIONS_CONTROLLER,
		action: ResourceActions.UPDATE,
	},
	{
		nameUz: 'reference-permissions-delete',
		nameRu: 'reference-permissions-delete',
		resource: REFERENCES_PERMISSIONS_CONTROLLER,
		action: ResourceActions.DELETE,
	},
	{
		nameUz: 'reference-permissions-list',
		nameRu: 'reference-permissions-list',
		resource: REFERENCES_PERMISSIONS_CONTROLLER,
		action: ResourceActions.READ,
	},
	{
		nameUz: 'reference-permissions-counts-by-status',
		nameRu: 'reference-permissions-counts-by-status',
		resource: REFERENCES_PERMISSIONS_CONTROLLER,
		action: ResourceActions.READ,
	},
];
