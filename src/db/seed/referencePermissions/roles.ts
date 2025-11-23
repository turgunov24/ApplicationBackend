import { InferSelectModel } from 'drizzle-orm';
import { referencesPermissionsTable } from '../../schemas';
import { REFERENCES_ROLES_CONTROLLER } from '../../../helpers/endPoints';
import { ResourceActions } from '../../../types/auth';

export const rolesPermissions: Array<
	Pick<
		InferSelectModel<typeof referencesPermissionsTable>,
		'nameRu' | 'nameUz' | 'resource' | 'action'
	>
> = [
	{
		nameUz: 'reference-roles-index',
		nameRu: 'reference-roles-index',
		resource: REFERENCES_ROLES_CONTROLLER,
		action: ResourceActions.READ,
	},
	{
		nameUz: 'reference-roles-create',
		nameRu: 'reference-roles-create',
		resource: REFERENCES_ROLES_CONTROLLER,
		action: ResourceActions.CREATE,
	},
	{
		nameUz: 'reference-roles-update',
		nameRu: 'reference-roles-update',
		resource: REFERENCES_ROLES_CONTROLLER,
		action: ResourceActions.UPDATE,
	},
	{
		nameUz: 'reference-roles-delete',
		nameRu: 'reference-roles-delete',
		resource: REFERENCES_ROLES_CONTROLLER,
		action: ResourceActions.DELETE,
	},
	{
		nameUz: 'reference-roles-list',
		nameRu: 'reference-roles-list',
		resource: REFERENCES_ROLES_CONTROLLER.concat('/list'),
		action: ResourceActions.READ,
	},
	{
		nameUz: 'reference-roles-counts-by-status',
		nameRu: 'reference-roles-counts-by-status',
		resource: REFERENCES_ROLES_CONTROLLER.concat('/counts-by-status'),
		action: ResourceActions.READ,
	},
];
