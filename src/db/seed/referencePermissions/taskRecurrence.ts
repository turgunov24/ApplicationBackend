import { InferSelectModel } from 'drizzle-orm';
import { referencesPermissionsTable } from '../../schemas';
import { REFERENCES_TASK_RECURRENCE_CONTROLLER } from '../../../helpers/endPoints';
import { ResourceActions } from '../../../types/auth';

export const taskRecurrencePermissions: Array<
	Pick<
		InferSelectModel<typeof referencesPermissionsTable>,
		'nameRu' | 'nameUz' | 'resource' | 'action'
	>
> = [
	{
		nameUz: 'reference-task-recurrence-index',
		nameRu: 'reference-task-recurrence-index',
		resource: REFERENCES_TASK_RECURRENCE_CONTROLLER,
		action: ResourceActions.READ,
	},
	{
		nameUz: 'reference-task-recurrence-create',
		nameRu: 'reference-task-recurrence-create',
		resource: REFERENCES_TASK_RECURRENCE_CONTROLLER,
		action: ResourceActions.CREATE,
	},
	{
		nameUz: 'reference-task-recurrence-update',
		nameRu: 'reference-task-recurrence-update',
		resource: REFERENCES_TASK_RECURRENCE_CONTROLLER,
		action: ResourceActions.UPDATE,
	},
	{
		nameUz: 'reference-task-recurrence-delete',
		nameRu: 'reference-task-recurrence-delete',
		resource: REFERENCES_TASK_RECURRENCE_CONTROLLER,
		action: ResourceActions.DELETE,
	},
	{
		nameUz: 'reference-task-recurrence-list',
		nameRu: 'reference-task-recurrence-list',
		resource: REFERENCES_TASK_RECURRENCE_CONTROLLER.concat('/list'),
		action: ResourceActions.READ,
	},
	{
		nameUz: 'reference-task-recurrence-counts-by-status',
		nameRu: 'reference-task-recurrence-counts-by-status',
		resource: REFERENCES_TASK_RECURRENCE_CONTROLLER.concat('/counts-by-status'),
		action: ResourceActions.READ,
	},
];
