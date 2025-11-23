import { InferSelectModel } from 'drizzle-orm';
import { referencesPermissionsTable } from '../../schemas';
import { REFERENCES_REGIONS_CONTROLLER } from '../../../helpers/endPoints';
import { ResourceActions } from '../../../types/auth';

export const regionsPermissions: Array<
	Pick<
		InferSelectModel<typeof referencesPermissionsTable>,
		'nameRu' | 'nameUz' | 'resource' | 'action'
	>
> = [
	{
		nameUz: 'reference-regions-index',
		nameRu: 'reference-regions-index',
		resource: REFERENCES_REGIONS_CONTROLLER,
		action: ResourceActions.READ,
	},
	{
		nameUz: 'reference-regions-create',
		nameRu: 'reference-regions-create',
		resource: REFERENCES_REGIONS_CONTROLLER,
		action: ResourceActions.CREATE,
	},
	{
		nameUz: 'reference-regions-update',
		nameRu: 'reference-regions-update',
		resource: REFERENCES_REGIONS_CONTROLLER,
		action: ResourceActions.UPDATE,
	},
	{
		nameUz: 'reference-regions-delete',
		nameRu: 'reference-regions-delete',
		resource: REFERENCES_REGIONS_CONTROLLER,
		action: ResourceActions.DELETE,
	},
	{
		nameUz: 'reference-regions-list',
		nameRu: 'reference-regions-list',
		resource: REFERENCES_REGIONS_CONTROLLER.concat('/list'),
		action: ResourceActions.READ,
	},
	{
		nameUz: 'reference-regions-counts-by-status',
		nameRu: 'reference-regions-counts-by-status',
		resource: REFERENCES_REGIONS_CONTROLLER.concat('/counts-by-status'),
		action: ResourceActions.READ,
	},
];
