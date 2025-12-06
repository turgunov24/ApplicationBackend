import { REFERENCES_PERMISSIONS_CONTROLLER } from '../../../helpers/endPoints';
import { Resource, ResourceActions } from '../../../types/auth';

const resources: Resource[] = [
	{
		name: 'permissions-crud',
		endpoint: REFERENCES_PERMISSIONS_CONTROLLER,
		allowedActions: [
			ResourceActions.CREATE,
			ResourceActions.UPDATE,
			ResourceActions.READ,
			ResourceActions.DELETE,
		],
	},
	{
		name: 'permissions-list',
		endpoint: REFERENCES_PERMISSIONS_CONTROLLER.concat('/list'),
		allowedActions: [ResourceActions.READ],
	},
	{
		name: 'permissions-counts-by-status',
		endpoint:
		REFERENCES_PERMISSIONS_CONTROLLER.concat('/counts-by-status'),
		allowedActions: [ResourceActions.READ],
	},
];

export default resources;
