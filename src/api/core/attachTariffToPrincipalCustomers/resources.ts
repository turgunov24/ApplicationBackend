import { ATTACH_TARIFF_TO_PRINCIPAL_CUSTOMERS_CONTROLLER } from '../../../helpers/endPoints';
import { Resource, ResourceActions } from '../../../types/auth';

const resources: Resource[] = [
	{
		name: 'attach-tariff-to-principal-customers-crud',
		endpoint: ATTACH_TARIFF_TO_PRINCIPAL_CUSTOMERS_CONTROLLER,
		allowedActions: [
			ResourceActions.CREATE,
			ResourceActions.UPDATE,
			ResourceActions.READ,
			ResourceActions.DELETE,
		],
	},
	{
		name: 'attach-tariff-to-principal-customers-list',
		endpoint: ATTACH_TARIFF_TO_PRINCIPAL_CUSTOMERS_CONTROLLER.concat('/list'),
		allowedActions: [ResourceActions.READ],
	},
	{
		name: 'attach-tariff-to-principal-customers-counts-by-status',
		endpoint: ATTACH_TARIFF_TO_PRINCIPAL_CUSTOMERS_CONTROLLER.concat('/counts-by-status'),
		allowedActions: [ResourceActions.READ],
	},
];

export default resources;
