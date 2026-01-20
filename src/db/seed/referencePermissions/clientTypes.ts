import { InferSelectModel } from 'drizzle-orm';
import { referencesPermissionsTable } from '../../schemas';
import { REFERENCES_CLIENT_TYPES_CONTROLLER } from '../../../helpers/endPoints';
import { ResourceActions } from '../../../types/auth';

export const clientTypesPermissions: Array<
	Pick<
		InferSelectModel<typeof referencesPermissionsTable>,
		'nameRu' | 'nameUz' | 'resource' | 'action'
	>
> = [
	{
		nameUz: 'reference-client-types-index',
		nameRu: 'reference-client-types-index',
		resource: REFERENCES_CLIENT_TYPES_CONTROLLER,
		action: ResourceActions.READ,
	},
	{
		nameUz: 'reference-client-types-create',
		nameRu: 'reference-client-types-create',
		resource: REFERENCES_CLIENT_TYPES_CONTROLLER,
		action: ResourceActions.CREATE,
	},
	{
		nameUz: 'reference-client-types-update',
		nameRu: 'reference-client-types-update',
		resource: REFERENCES_CLIENT_TYPES_CONTROLLER,
		action: ResourceActions.UPDATE,
	},
	{
		nameUz: 'reference-client-types-delete',
		nameRu: 'reference-client-types-delete',
		resource: REFERENCES_CLIENT_TYPES_CONTROLLER,
		action: ResourceActions.DELETE,
	},
	{
		nameUz: 'reference-client-types-list',
		nameRu: 'reference-client-types-list',
		resource: REFERENCES_CLIENT_TYPES_CONTROLLER.concat('/list'),
		action: ResourceActions.READ,
	},
	{
		nameUz: 'reference-client-types-counts-by-status',
		nameRu: 'reference-client-types-counts-by-status',
		resource: REFERENCES_CLIENT_TYPES_CONTROLLER.concat('/counts-by-status'),
		action: ResourceActions.READ,
	},
];
