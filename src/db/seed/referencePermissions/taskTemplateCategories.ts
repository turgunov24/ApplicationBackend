import { InferSelectModel } from 'drizzle-orm';
import { referencesPermissionsTable } from '../../schemas';
import { REFERENCES_TASK_TEMPLATE_CATEGORIES_CONTROLLER } from '../../../helpers/endPoints';
import { ResourceActions } from '../../../types/auth';

export const taskTemplateCategoriesPermissions: Array<
	Pick<
		InferSelectModel<typeof referencesPermissionsTable>,
		'nameRu' | 'nameUz' | 'resource' | 'action'
	>
> = [
	{
		nameUz: 'reference-task-template-categories-index',
		nameRu: 'reference-task-template-categories-index',
		resource: REFERENCES_TASK_TEMPLATE_CATEGORIES_CONTROLLER,
		action: ResourceActions.READ,
	},
	{
		nameUz: 'reference-task-template-categories-create',
		nameRu: 'reference-task-template-categories-create',
		resource: REFERENCES_TASK_TEMPLATE_CATEGORIES_CONTROLLER,
		action: ResourceActions.CREATE,
	},
	{
		nameUz: 'reference-task-template-categories-update',
		nameRu: 'reference-task-template-categories-update',
		resource: REFERENCES_TASK_TEMPLATE_CATEGORIES_CONTROLLER,
		action: ResourceActions.UPDATE,
	},
	{
		nameUz: 'reference-task-template-categories-delete',
		nameRu: 'reference-task-template-categories-delete',
		resource: REFERENCES_TASK_TEMPLATE_CATEGORIES_CONTROLLER,
		action: ResourceActions.DELETE,
	},
	{
		nameUz: 'reference-task-template-categories-list',
		nameRu: 'reference-task-template-categories-list',
		resource: REFERENCES_TASK_TEMPLATE_CATEGORIES_CONTROLLER.concat('/list'),
		action: ResourceActions.READ,
	},
	{
		nameUz: 'reference-task-template-categories-counts-by-status',
		nameRu: 'reference-task-template-categories-counts-by-status',
		resource: REFERENCES_TASK_TEMPLATE_CATEGORIES_CONTROLLER.concat('/counts-by-status'),
		action: ResourceActions.READ,
	},
];
