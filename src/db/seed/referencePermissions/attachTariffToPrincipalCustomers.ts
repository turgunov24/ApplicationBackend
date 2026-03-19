import { InferSelectModel } from 'drizzle-orm';
import { referencesPermissionsTable } from '../../schemas';
import { ATTACH_TARIFF_TO_PRINCIPAL_CUSTOMERS_CONTROLLER } from '../../../helpers/endPoints';
import { ResourceActions } from '../../../types/auth';

export const attachTariffToPrincipalCustomersPermissions: Array<
	Pick<
		InferSelectModel<typeof referencesPermissionsTable>,
		'nameRu' | 'nameUz' | 'resource' | 'action'
	>
> = [
	{
		nameUz: 'attach-tariff-to-principal-customers-index',
		nameRu: 'attach-tariff-to-principal-customers-index',
		resource: ATTACH_TARIFF_TO_PRINCIPAL_CUSTOMERS_CONTROLLER,
		action: ResourceActions.READ,
	},
	{
		nameUz: 'attach-tariff-to-principal-customers-create',
		nameRu: 'attach-tariff-to-principal-customers-create',
		resource: ATTACH_TARIFF_TO_PRINCIPAL_CUSTOMERS_CONTROLLER,
		action: ResourceActions.CREATE,
	},
	{
		nameUz: 'attach-tariff-to-principal-customers-update',
		nameRu: 'attach-tariff-to-principal-customers-update',
		resource: ATTACH_TARIFF_TO_PRINCIPAL_CUSTOMERS_CONTROLLER,
		action: ResourceActions.UPDATE,
	},
	{
		nameUz: 'attach-tariff-to-principal-customers-delete',
		nameRu: 'attach-tariff-to-principal-customers-delete',
		resource: ATTACH_TARIFF_TO_PRINCIPAL_CUSTOMERS_CONTROLLER,
		action: ResourceActions.DELETE,
	},
	{
		nameUz: 'attach-tariff-to-principal-customers-list',
		nameRu: 'attach-tariff-to-principal-customers-list',
		resource: ATTACH_TARIFF_TO_PRINCIPAL_CUSTOMERS_CONTROLLER.concat('/list'),
		action: ResourceActions.READ,
	},
	{
		nameUz: 'attach-tariff-to-principal-customers-counts-by-status',
		nameRu: 'attach-tariff-to-principal-customers-counts-by-status',
		resource: ATTACH_TARIFF_TO_PRINCIPAL_CUSTOMERS_CONTROLLER.concat('/counts-by-status'),
		action: ResourceActions.READ,
	},
];
