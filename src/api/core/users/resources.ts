import { USERS_CONTROLLER } from '../../../helpers/endPoints';
import { Resource, ResourceActions } from '../../../types/auth';

const recources: Resource[] = [
	{
		name: 'users-crud',
		endpoint: USERS_CONTROLLER,
		allowedActions: [
			ResourceActions.CREATE,
			ResourceActions.UPDATE,
			ResourceActions.READ,
			ResourceActions.DELETE,
		],
	},
	{
		name: 'counts-by-status',
		endpoint: USERS_CONTROLLER.concat('/counts-by-status'),
		allowedActions: [ResourceActions.READ],
	},
];

export default recources;
