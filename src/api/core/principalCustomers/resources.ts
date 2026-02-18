import { PRINCIPAL_CUSTOMERS_CONTROLLER } from '../../../helpers/endPoints';
import { Resource, ResourceActions } from '../../../types/auth';

const resources: Resource[] = [
	{
		name: 'principal-customers-crud',
		endpoint: PRINCIPAL_CUSTOMERS_CONTROLLER,
		allowedActions: [
			ResourceActions.CREATE,
			ResourceActions.UPDATE,
			ResourceActions.READ,
			ResourceActions.DELETE,
		],
	},
	{
		name: 'principal-customers-list',
		endpoint: PRINCIPAL_CUSTOMERS_CONTROLLER.concat('/list'),
		allowedActions: [ResourceActions.READ],
	},
	{
		name: 'principal-customers-counts-by-status',
		endpoint: PRINCIPAL_CUSTOMERS_CONTROLLER.concat('/counts-by-status'),
		allowedActions: [ResourceActions.READ],
	},
];

export default resources;
