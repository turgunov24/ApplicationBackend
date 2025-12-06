import { REFERENCES_ROLES_CONTROLLER } from '../../../helpers/endPoints';
import { Resource, ResourceActions } from '../../../types/auth';

const resources: Resource[] = [
	{
		name: 'roles-crud',
		endpoint: REFERENCES_ROLES_CONTROLLER,
		allowedActions: [
			ResourceActions.CREATE,
			ResourceActions.UPDATE,
			ResourceActions.READ,
			ResourceActions.DELETE,
		],
	},
	{
		name: 'roles-list',
		endpoint: REFERENCES_ROLES_CONTROLLER.concat('/list'),
		allowedActions: [ResourceActions.READ],
	},
	{
		name: 'roles-counts-by-status',
		endpoint: REFERENCES_ROLES_CONTROLLER.concat('/counts-by-status'),
		allowedActions: [ResourceActions.READ],
	},
];

export default resources;
