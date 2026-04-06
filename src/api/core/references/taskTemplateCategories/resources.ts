import { REFERENCES_TASK_TEMPLATE_CATEGORIES_CONTROLLER } from '../../../../helpers/endPoints';
import { Resource, ResourceActions } from '../../../../types/auth';

const resources: Resource[] = [
	{
		name: 'task-template-categories-crud',
		endpoint: REFERENCES_TASK_TEMPLATE_CATEGORIES_CONTROLLER,
		allowedActions: [
			ResourceActions.CREATE,
			ResourceActions.UPDATE,
			ResourceActions.READ,
			ResourceActions.DELETE,
		],
	},
	{
		name: 'task-template-categories-list',
		endpoint: REFERENCES_TASK_TEMPLATE_CATEGORIES_CONTROLLER.concat('/list'),
		allowedActions: [ResourceActions.READ],
	},
	{
		name: 'task-template-categories-counts-by-status',
		endpoint: REFERENCES_TASK_TEMPLATE_CATEGORIES_CONTROLLER.concat('/counts-by-status'),
		allowedActions: [ResourceActions.READ],
	},
];

export default resources;
