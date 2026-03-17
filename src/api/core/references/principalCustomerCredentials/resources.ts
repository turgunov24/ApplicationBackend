import { REFERENCES_PRINCIPAL_CUSTOMER_CREDENTIALS_CONTROLLER } from '../../../../helpers/endPoints';
import { Resource, ResourceActions } from '../../../../types/auth';

const resources: Resource[] = [
	{
		name: 'principal-customer-credentials-crud',
		endpoint: REFERENCES_PRINCIPAL_CUSTOMER_CREDENTIALS_CONTROLLER,
		allowedActions: [
			ResourceActions.CREATE,
			ResourceActions.UPDATE,
			ResourceActions.READ,
			ResourceActions.DELETE,
		],
	},
	{
		name: 'principal-customer-credentials-list',
		endpoint: REFERENCES_PRINCIPAL_CUSTOMER_CREDENTIALS_CONTROLLER.concat('/list'),
		allowedActions: [ResourceActions.READ],
	},
	{
		name: 'principal-customer-credentials-counts-by-status',
		endpoint: REFERENCES_PRINCIPAL_CUSTOMER_CREDENTIALS_CONTROLLER.concat('/counts-by-status'),
		allowedActions: [ResourceActions.READ],
	},
];

export default resources;

