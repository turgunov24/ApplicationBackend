import { InferSelectModel } from 'drizzle-orm';
import { referencesPermissionsTable } from '../../schemas';
import { REFERENCES_TASK_TEMPLATES_CONTROLLER } from '../../../helpers/endPoints';
import { ResourceActions } from '../../../types/auth';

export const taskTemplatesPermissions: Array<
	Pick<
		InferSelectModel<typeof referencesPermissionsTable>,
		'nameRu' | 'nameUz' | 'resource' | 'action'
	>
> = [
	{
		nameUz: 'reference-task-templates-index',
		nameRu: 'reference-task-templates-index',
		resource: REFERENCES_TASK_TEMPLATES_CONTROLLER,
		action: ResourceActions.READ,
	},
	{
		nameUz: 'reference-task-templates-create',
		nameRu: 'reference-task-templates-create',
		resource: REFERENCES_TASK_TEMPLATES_CONTROLLER,
		action: ResourceActions.CREATE,
	},
	{
		nameUz: 'reference-task-templates-update',
		nameRu: 'reference-task-templates-update',
		resource: REFERENCES_TASK_TEMPLATES_CONTROLLER,
		action: ResourceActions.UPDATE,
	},
	{
		nameUz: 'reference-task-templates-delete',
		nameRu: 'reference-task-templates-delete',
		resource: REFERENCES_TASK_TEMPLATES_CONTROLLER,
		action: ResourceActions.DELETE,
	},
	{
		nameUz: 'reference-task-templates-list',
		nameRu: 'reference-task-templates-list',
		resource: REFERENCES_TASK_TEMPLATES_CONTROLLER.concat('/list'),
		action: ResourceActions.READ,
	},
	{
		nameUz: 'reference-task-templates-counts-by-status',
		nameRu: 'reference-task-templates-counts-by-status',
		resource: REFERENCES_TASK_TEMPLATES_CONTROLLER.concat('/counts-by-status'),
		action: ResourceActions.READ,
	},
];
