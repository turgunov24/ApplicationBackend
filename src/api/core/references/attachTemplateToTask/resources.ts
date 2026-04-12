import { REFERENCES_ATTACH_TEMPLATE_TO_TASK_CONTROLLER } from '../../../../helpers/endPoints';
import { Resource, ResourceActions } from '../../../../types/auth';

const resources: Resource[] = [
	{
		name: 'attach-template-to-task-crud',
		endpoint: REFERENCES_ATTACH_TEMPLATE_TO_TASK_CONTROLLER,
		allowedActions: [
			ResourceActions.CREATE,
			ResourceActions.UPDATE,
			ResourceActions.READ,
			ResourceActions.DELETE,
		],
	},
	{
		name: 'attach-template-to-task-list',
		endpoint: REFERENCES_ATTACH_TEMPLATE_TO_TASK_CONTROLLER.concat('/list'),
		allowedActions: [ResourceActions.READ],
	},
	{
		name: 'attach-template-to-task-counts-by-status',
		endpoint: REFERENCES_ATTACH_TEMPLATE_TO_TASK_CONTROLLER.concat('/counts-by-status'),
		allowedActions: [ResourceActions.READ],
	},
];

export default resources;
