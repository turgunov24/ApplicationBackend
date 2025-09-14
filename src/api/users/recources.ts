import { USERS_CONTROLLER } from '../../helpers/endPoints';
import { PolicyRecources, RecourceActions } from '../../policy/types';

const recources: PolicyRecources = [
	{
		name: 'users-crud',
		endpoint: USERS_CONTROLLER,
		actions: [
			RecourceActions.CREATE,
			RecourceActions.UPDATE,
			RecourceActions.READ,
			RecourceActions.DELETE,
		],
	},
	{
		name: 'counts-by-status',
		endpoint: USERS_CONTROLLER.concat('/counts-by-status'),
		actions: [RecourceActions.READ],
	},
];

export default recources;
