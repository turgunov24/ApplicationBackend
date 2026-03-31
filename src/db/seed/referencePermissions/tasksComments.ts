import { InferSelectModel } from 'drizzle-orm';
import { referencesPermissionsTable } from '../../schemas';
import { REFERENCES_TASKS_COMMENTS_CONTROLLER } from '../../../helpers/endPoints';
import { ResourceActions } from '../../../types/auth';

export const tasksCommentsPermissions: Array<
	Pick<
		InferSelectModel<typeof referencesPermissionsTable>,
		'nameRu' | 'nameUz' | 'resource' | 'action'
	>
> = [
	{
		nameUz: 'reference-tasks-comments-index',
		nameRu: 'reference-tasks-comments-index',
		resource: REFERENCES_TASKS_COMMENTS_CONTROLLER,
		action: ResourceActions.READ,
	},
	{
		nameUz: 'reference-tasks-comments-create',
		nameRu: 'reference-tasks-comments-create',
		resource: REFERENCES_TASKS_COMMENTS_CONTROLLER,
		action: ResourceActions.CREATE,
	},
	{
		nameUz: 'reference-tasks-comments-update',
		nameRu: 'reference-tasks-comments-update',
		resource: REFERENCES_TASKS_COMMENTS_CONTROLLER,
		action: ResourceActions.UPDATE,
	},
	{
		nameUz: 'reference-tasks-comments-delete',
		nameRu: 'reference-tasks-comments-delete',
		resource: REFERENCES_TASKS_COMMENTS_CONTROLLER,
		action: ResourceActions.DELETE,
	},
	{
		nameUz: 'reference-tasks-comments-list',
		nameRu: 'reference-tasks-comments-list',
		resource: REFERENCES_TASKS_COMMENTS_CONTROLLER.concat('/list'),
		action: ResourceActions.READ,
	},
	{
		nameUz: 'reference-tasks-comments-counts-by-status',
		nameRu: 'reference-tasks-comments-counts-by-status',
		resource: REFERENCES_TASKS_COMMENTS_CONTROLLER.concat('/counts-by-status'),
		action: ResourceActions.READ,
	},
];
