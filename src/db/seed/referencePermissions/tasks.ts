import { InferSelectModel } from 'drizzle-orm';
import { referencesPermissionsTable } from '../../schemas';
import { REFERENCES_TASKS_CONTROLLER } from '../../../helpers/endPoints';
import { ResourceActions } from '../../../types/auth';

export const tasksPermissions: Array<
	Pick<
		InferSelectModel<typeof referencesPermissionsTable>,
		'nameRu' | 'nameUz' | 'resource' | 'action'
	>
> = [
	{
		nameUz: 'reference-tasks-index',
		nameRu: 'reference-tasks-index',
		resource: REFERENCES_TASKS_CONTROLLER,
		action: ResourceActions.READ,
	},
	{
		nameUz: 'reference-tasks-create',
		nameRu: 'reference-tasks-create',
		resource: REFERENCES_TASKS_CONTROLLER,
		action: ResourceActions.CREATE,
	},
	{
		nameUz: 'reference-tasks-update',
		nameRu: 'reference-tasks-update',
		resource: REFERENCES_TASKS_CONTROLLER,
		action: ResourceActions.UPDATE,
	},
	{
		nameUz: 'reference-tasks-delete',
		nameRu: 'reference-tasks-delete',
		resource: REFERENCES_TASKS_CONTROLLER,
		action: ResourceActions.DELETE,
	},
	{
		nameUz: 'reference-tasks-list',
		nameRu: 'reference-tasks-list',
		resource: REFERENCES_TASKS_CONTROLLER.concat('/list'),
		action: ResourceActions.READ,
	},
	{
		nameUz: 'reference-tasks-counts-by-status',
		nameRu: 'reference-tasks-counts-by-status',
		resource: REFERENCES_TASKS_CONTROLLER.concat('/counts-by-status'),
		action: ResourceActions.READ,
	},
];
