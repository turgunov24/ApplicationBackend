import { REFERENCES_CLIENT_TYPES_CONTROLLER } from '../../../helpers/endPoints';
import { Resource, ResourceActions } from '../../../types/auth';

const resources: Resource[] = [
	{
		name: 'client-types-crud',
		endpoint: REFERENCES_CLIENT_TYPES_CONTROLLER,
		allowedActions: [
			ResourceActions.CREATE,
			ResourceActions.UPDATE,
			ResourceActions.READ,
			ResourceActions.DELETE,
		],
	},
	{
		name: 'client-types-list',
		endpoint: REFERENCES_CLIENT_TYPES_CONTROLLER.concat('/list'),
		allowedActions: [ResourceActions.READ],
	},
	{
		name: 'client-types-counts-by-status',
		endpoint: REFERENCES_CLIENT_TYPES_CONTROLLER.concat('/counts-by-status'),
		allowedActions: [ResourceActions.READ],
	},
];

export default resources;
