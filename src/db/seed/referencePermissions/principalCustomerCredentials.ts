import { InferSelectModel } from 'drizzle-orm';
import { referencesPermissionsTable } from '../../schemas';
import { REFERENCES_PRINCIPAL_CUSTOMER_CREDENTIALS_CONTROLLER } from '../../../helpers/endPoints';
import { ResourceActions } from '../../../types/auth';

export const principalCustomerCredentialsPermissions: Array<
	Pick<
		InferSelectModel<typeof referencesPermissionsTable>,
		'nameRu' | 'nameUz' | 'resource' | 'action'
	>
> = [
	{
		nameUz: 'reference-principal-customer-credentials-index',
		nameRu: 'reference-principal-customer-credentials-index',
		resource: REFERENCES_PRINCIPAL_CUSTOMER_CREDENTIALS_CONTROLLER,
		action: ResourceActions.READ,
	},
	{
		nameUz: 'reference-principal-customer-credentials-create',
		nameRu: 'reference-principal-customer-credentials-create',
		resource: REFERENCES_PRINCIPAL_CUSTOMER_CREDENTIALS_CONTROLLER,
		action: ResourceActions.CREATE,
	},
	{
		nameUz: 'reference-principal-customer-credentials-update',
		nameRu: 'reference-principal-customer-credentials-update',
		resource: REFERENCES_PRINCIPAL_CUSTOMER_CREDENTIALS_CONTROLLER,
		action: ResourceActions.UPDATE,
	},
	{
		nameUz: 'reference-principal-customer-credentials-delete',
		nameRu: 'reference-principal-customer-credentials-delete',
		resource: REFERENCES_PRINCIPAL_CUSTOMER_CREDENTIALS_CONTROLLER,
		action: ResourceActions.DELETE,
	},
	{
		nameUz: 'reference-principal-customer-credentials-list',
		nameRu: 'reference-principal-customer-credentials-list',
		resource: REFERENCES_PRINCIPAL_CUSTOMER_CREDENTIALS_CONTROLLER.concat('/list'),
		action: ResourceActions.READ,
	},
	{
		nameUz: 'reference-principal-customer-credentials-counts-by-status',
		nameRu: 'reference-principal-customer-credentials-counts-by-status',
		resource: REFERENCES_PRINCIPAL_CUSTOMER_CREDENTIALS_CONTROLLER.concat('/counts-by-status'),
		action: ResourceActions.READ,
	},
];
