import { InferSelectModel } from 'drizzle-orm';
import { referencesPermissionsTable } from '../../schemas';
import { REFERENCES_CURRENCIES_CONTROLLER } from '../../../helpers/endPoints';
import { ResourceActions } from '../../../types/auth';

export const currenciesPermissions: Array<
	Pick<
		InferSelectModel<typeof referencesPermissionsTable>,
		'nameRu' | 'nameUz' | 'resource' | 'action'
	>
> = [
	{
		nameUz: 'reference-currencies-index',
		nameRu: 'reference-currencies-index',
		resource: REFERENCES_CURRENCIES_CONTROLLER,
		action: ResourceActions.READ,
	},
	{
		nameUz: 'reference-currencies-create',
		nameRu: 'reference-currencies-create',
		resource: REFERENCES_CURRENCIES_CONTROLLER,
		action: ResourceActions.CREATE,
	},
	{
		nameUz: 'reference-currencies-update',
		nameRu: 'reference-currencies-update',
		resource: REFERENCES_CURRENCIES_CONTROLLER,
		action: ResourceActions.UPDATE,
	},
	{
		nameUz: 'reference-currencies-delete',
		nameRu: 'reference-currencies-delete',
		resource: REFERENCES_CURRENCIES_CONTROLLER,
		action: ResourceActions.DELETE,
	},
	{
		nameUz: 'reference-currencies-list',
		nameRu: 'reference-currencies-list',
		resource: REFERENCES_CURRENCIES_CONTROLLER.concat('/list'),
		action: ResourceActions.READ,
	},
	{
		nameUz: 'reference-currencies-counts-by-status',
		nameRu: 'reference-currencies-counts-by-status',
		resource: REFERENCES_CURRENCIES_CONTROLLER.concat('/counts-by-status'),
		action: ResourceActions.READ,
	},
];
