import { REFERENCES_TASK_ACTIONS_HISTORY_CONTROLLER } from '../../../../helpers/endPoints';
import { Resource, ResourceActions } from '../../../../types/auth';

const resources: Resource[] = [
	{
		name: 'task-actions-history-crud',
		endpoint: REFERENCES_TASK_ACTIONS_HISTORY_CONTROLLER,
		allowedActions: [
			ResourceActions.READ,
		],
	},
	{
		name: 'task-actions-history-change-status',
		endpoint: REFERENCES_TASK_ACTIONS_HISTORY_CONTROLLER.concat('/change-status'),
		allowedActions: [ResourceActions.CREATE],
	},
];

export default resources;
