import { InferSelectModel } from 'drizzle-orm';
import { referencesPermissionsTable } from '../../schemas';
import { PRINCIPAL_CUSTOMERS_CONTROLLER } from '../../../helpers/endPoints';
import { ResourceActions } from '../../../types/auth';

export const principalCustomersPermissions: Array<
	Pick<
		InferSelectModel<typeof referencesPermissionsTable>,
		'nameRu' | 'nameUz' | 'resource' | 'action'
	>
> = [
	{
		nameUz: 'principal-customers-index',
		nameRu: 'principal-customers-index',
		resource: PRINCIPAL_CUSTOMERS_CONTROLLER,
		action: ResourceActions.READ,
	},
	{
		nameUz: 'principal-customers-create',
		nameRu: 'principal-customers-create',
		resource: PRINCIPAL_CUSTOMERS_CONTROLLER,
		action: ResourceActions.CREATE,
	},
	{
		nameUz: 'principal-customers-update',
		nameRu: 'principal-customers-update',
		resource: PRINCIPAL_CUSTOMERS_CONTROLLER,
		action: ResourceActions.UPDATE,
	},
	{
		nameUz: 'principal-customers-delete',
		nameRu: 'principal-customers-delete',
		resource: PRINCIPAL_CUSTOMERS_CONTROLLER,
		action: ResourceActions.DELETE,
	},
	{
		nameUz: 'principal-customers-counts-by-status',
		nameRu: 'principal-customers-counts-by-status',
		resource: PRINCIPAL_CUSTOMERS_CONTROLLER.concat('/counts-by-status'),
		action: ResourceActions.READ,
	},
];
