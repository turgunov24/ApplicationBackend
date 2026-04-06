import { REFERENCES_TASK_RECURRENCE_CONTROLLER } from '../../../../helpers/endPoints';
import { Resource, ResourceActions } from '../../../../types/auth';

const resources: Resource[] = [
	{
		name: 'task-recurrence-crud',
		endpoint: REFERENCES_TASK_RECURRENCE_CONTROLLER,
		allowedActions: [
			ResourceActions.CREATE,
			ResourceActions.UPDATE,
			ResourceActions.READ,
			ResourceActions.DELETE,
		],
	},
	{
		name: 'task-recurrence-list',
		endpoint: REFERENCES_TASK_RECURRENCE_CONTROLLER.concat('/list'),
		allowedActions: [ResourceActions.READ],
	},
	{
		name: 'task-recurrence-counts-by-status',
		endpoint: REFERENCES_TASK_RECURRENCE_CONTROLLER.concat('/counts-by-status'),
		allowedActions: [ResourceActions.READ],
	},
];

export default resources;
