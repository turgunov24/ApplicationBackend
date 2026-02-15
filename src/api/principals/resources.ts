import { PRINCIPALS_CONTROLLER } from '../../helpers/endPoints';
import { Resource, ResourceActions } from '../../types/auth';

const resources: Resource[] = [
	{
		name: 'principals-crud',
		endpoint: PRINCIPALS_CONTROLLER,
		allowedActions: [
			ResourceActions.CREATE,
			ResourceActions.UPDATE,
			ResourceActions.READ,
			ResourceActions.DELETE,
		],
	},
	{
		name: 'counts-by-status',
		endpoint: PRINCIPALS_CONTROLLER.concat('/counts-by-status'),
		allowedActions: [ResourceActions.READ],
	},
];

export default resources;
