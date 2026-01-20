import { REFERENCES_CURRENCIES_CONTROLLER } from '../../../helpers/endPoints';
import { Resource, ResourceActions } from '../../../types/auth';

const resources: Resource[] = [
	{
		// bu yerda bittalab junatishimiz kerak
		name: 'currencies-crud',
		endpoint: REFERENCES_CURRENCIES_CONTROLLER,
		allowedActions: [
			ResourceActions.CREATE,
			ResourceActions.UPDATE,
			ResourceActions.READ,
			ResourceActions.DELETE,
		],
	},
	{
		name: 'currencies-list',
		endpoint: REFERENCES_CURRENCIES_CONTROLLER.concat('/list'),
		allowedActions: [ResourceActions.READ],
	},
	{
		name: 'currencies-counts-by-status',
		endpoint: REFERENCES_CURRENCIES_CONTROLLER.concat('/counts-by-status'),
		allowedActions: [ResourceActions.READ],
	},
];

export default resources;
