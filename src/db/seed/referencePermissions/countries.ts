import { InferSelectModel } from 'drizzle-orm';
import { referencesPermissionsTable } from '../../schemas';
import { REFERENCES_COUNTRIES_CONTROLLER } from '../../../helpers/endPoints';
import { ResourceActions } from '../../../types/auth';

export const countriesPermissions: Array<
	Pick<
		InferSelectModel<typeof referencesPermissionsTable>,
		'nameRu' | 'nameUz' | 'resource' | 'action'
	>
> = [
	{
		nameUz: 'reference-countries-index',
		nameRu: 'reference-countries-index',
		resource: REFERENCES_COUNTRIES_CONTROLLER,
		action: ResourceActions.READ,
	},
	{
		nameUz: 'reference-countries-create',
		nameRu: 'reference-countries-create',
		resource: REFERENCES_COUNTRIES_CONTROLLER,
		action: ResourceActions.CREATE,
	},
	{
		nameUz: 'reference-countries-update',
		nameRu: 'reference-countries-update',
		resource: REFERENCES_COUNTRIES_CONTROLLER,
		action: ResourceActions.UPDATE,
	},
	{
		nameUz: 'reference-countries-delete',
		nameRu: 'reference-countries-delete',
		resource: REFERENCES_COUNTRIES_CONTROLLER,
		action: ResourceActions.DELETE,
	},
	{
		nameUz: 'reference-countries-list',
		nameRu: 'reference-countries-list',
		resource: REFERENCES_COUNTRIES_CONTROLLER,
		action: ResourceActions.READ,
	},
	{
		nameUz: 'reference-countries-counts-by-status',
		nameRu: 'reference-countries-counts-by-status',
		resource: REFERENCES_COUNTRIES_CONTROLLER,
		action: ResourceActions.READ,
	},
];
