import { REFERENCES_TASK_TEMPLATES_CONTROLLER } from '../../../../helpers/endPoints';
import { Resource, ResourceActions } from '../../../../types/auth';

const resources: Resource[] = [
	{
		name: 'task-templates-crud',
		endpoint: REFERENCES_TASK_TEMPLATES_CONTROLLER,
		allowedActions: [
			ResourceActions.CREATE,
			ResourceActions.UPDATE,
			ResourceActions.READ,
			ResourceActions.DELETE,
		],
	},
	{
		name: 'task-templates-list',
		endpoint: REFERENCES_TASK_TEMPLATES_CONTROLLER.concat('/list'),
		allowedActions: [ResourceActions.READ],
	},
	{
		name: 'task-templates-counts-by-status',
		endpoint: REFERENCES_TASK_TEMPLATES_CONTROLLER.concat('/counts-by-status'),
		allowedActions: [ResourceActions.READ],
	},
];

export default resources;
