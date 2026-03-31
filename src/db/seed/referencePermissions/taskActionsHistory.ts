import { InferSelectModel } from 'drizzle-orm';
import { referencesPermissionsTable } from '../../schemas';
import { REFERENCES_TASK_ACTIONS_HISTORY_CONTROLLER } from '../../../helpers/endPoints';
import { ResourceActions } from '../../../types/auth';

export const taskActionsHistoryPermissions: Array<
	Pick<
		InferSelectModel<typeof referencesPermissionsTable>,
		'nameRu' | 'nameUz' | 'resource' | 'action'
	>
> = [
	{
		nameUz: 'reference-task-actions-history-index',
		nameRu: 'reference-task-actions-history-index',
		resource: REFERENCES_TASK_ACTIONS_HISTORY_CONTROLLER,
		action: ResourceActions.READ,
	},
	{
		nameUz: 'reference-task-actions-history-change-status',
		nameRu: 'reference-task-actions-history-change-status',
		resource: REFERENCES_TASK_ACTIONS_HISTORY_CONTROLLER.concat('/change-status'),
		action: ResourceActions.CREATE,
	},
];
