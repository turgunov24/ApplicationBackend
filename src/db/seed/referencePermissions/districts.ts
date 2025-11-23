import { InferSelectModel } from 'drizzle-orm';
import { referencesPermissionsTable } from '../../schemas';
import { REFERENCES_DISTRICTS_CONTROLLER } from '../../../helpers/endPoints';
import { ResourceActions } from '../../../types/auth';

export const districtsPermissions: Array<
	Pick<
		InferSelectModel<typeof referencesPermissionsTable>,
		'nameRu' | 'nameUz' | 'resource' | 'action'
	>
> = [
	{
		nameUz: 'reference-districts-index',
		nameRu: 'reference-districts-index',
		resource: REFERENCES_DISTRICTS_CONTROLLER,
		action: ResourceActions.READ,
	},
	{
		nameUz: 'reference-districts-create',
		nameRu: 'reference-districts-create',
		resource: REFERENCES_DISTRICTS_CONTROLLER,
		action: ResourceActions.CREATE,
	},
	{
		nameUz: 'reference-districts-update',
		nameRu: 'reference-districts-update',
		resource: REFERENCES_DISTRICTS_CONTROLLER,
		action: ResourceActions.UPDATE,
	},
	{
		nameUz: 'reference-districts-delete',
		nameRu: 'reference-districts-delete',
		resource: REFERENCES_DISTRICTS_CONTROLLER,
		action: ResourceActions.DELETE,
	},
	{
		nameUz: 'reference-districts-list',
		nameRu: 'reference-districts-list',
		resource: REFERENCES_DISTRICTS_CONTROLLER,
		action: ResourceActions.READ,	
	},
	{
		nameUz: 'reference-districts-counts-by-status',
		nameRu: 'reference-districts-counts-by-status',
		resource: REFERENCES_DISTRICTS_CONTROLLER,
		action: ResourceActions.READ,
	},
];
