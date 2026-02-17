import { REFERENCES_PERMISSION_GROUPS_CONTROLLER } from '../../../../helpers/endPoints';
import { Resource, ResourceActions } from '../../../../types/auth';

const resources: Resource[] = [
	{
		name: 'permission-group-crud',
		endpoint: REFERENCES_PERMISSION_GROUPS_CONTROLLER,
		allowedActions: [
			ResourceActions.CREATE,
			ResourceActions.UPDATE,
			ResourceActions.READ,
			ResourceActions.DELETE,
		],
	},
	{
		name: 'permission-group-list',
		endpoint: REFERENCES_PERMISSION_GROUPS_CONTROLLER.concat('/list'),
		allowedActions: [ResourceActions.READ],
	},
	{
		name: 'permission-group-counts-by-status',
		endpoint:
			REFERENCES_PERMISSION_GROUPS_CONTROLLER.concat('/counts-by-status'),
		allowedActions: [ResourceActions.READ],
	},
];

export default resources;
