import { REFERENCES_TASKS_COMMENTS_CONTROLLER } from '../../../../helpers/endPoints';
import { Resource, ResourceActions } from '../../../../types/auth';

const resources: Resource[] = [
	{
		name: 'tasks-comments-crud',
		endpoint: REFERENCES_TASKS_COMMENTS_CONTROLLER,
		allowedActions: [
			ResourceActions.CREATE,
			ResourceActions.UPDATE,
			ResourceActions.READ,
			ResourceActions.DELETE,
		],
	},
	{
		name: 'tasks-comments-list',
		endpoint: REFERENCES_TASKS_COMMENTS_CONTROLLER.concat('/list'),
		allowedActions: [ResourceActions.READ],
	},
	{
		name: 'tasks-comments-counts-by-status',
		endpoint: REFERENCES_TASKS_COMMENTS_CONTROLLER.concat('/counts-by-status'),
		allowedActions: [ResourceActions.READ],
	},
];

export default resources;
