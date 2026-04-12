import { InferSelectModel } from 'drizzle-orm';
import { referencesPermissionsTable } from '../../schemas';
import { REFERENCES_ATTACH_TEMPLATE_TO_TASK_CONTROLLER } from '../../../helpers/endPoints';
import { ResourceActions } from '../../../types/auth';

export const attachTemplateToTaskPermissions: Array<
	Pick<
		InferSelectModel<typeof referencesPermissionsTable>,
		'nameRu' | 'nameUz' | 'resource' | 'action'
	>
> = [
	{
		nameUz: 'reference-attach-template-to-task-index',
		nameRu: 'reference-attach-template-to-task-index',
		resource: REFERENCES_ATTACH_TEMPLATE_TO_TASK_CONTROLLER,
		action: ResourceActions.READ,
	},
	{
		nameUz: 'reference-attach-template-to-task-create',
		nameRu: 'reference-attach-template-to-task-create',
		resource: REFERENCES_ATTACH_TEMPLATE_TO_TASK_CONTROLLER,
		action: ResourceActions.CREATE,
	},
	{
		nameUz: 'reference-attach-template-to-task-update',
		nameRu: 'reference-attach-template-to-task-update',
		resource: REFERENCES_ATTACH_TEMPLATE_TO_TASK_CONTROLLER,
		action: ResourceActions.UPDATE,
	},
	{
		nameUz: 'reference-attach-template-to-task-delete',
		nameRu: 'reference-attach-template-to-task-delete',
		resource: REFERENCES_ATTACH_TEMPLATE_TO_TASK_CONTROLLER,
		action: ResourceActions.DELETE,
	},
	{
		nameUz: 'reference-attach-template-to-task-list',
		nameRu: 'reference-attach-template-to-task-list',
		resource: REFERENCES_ATTACH_TEMPLATE_TO_TASK_CONTROLLER.concat('/list'),
		action: ResourceActions.READ,
	},
	{
		nameUz: 'reference-attach-template-to-task-counts-by-status',
		nameRu: 'reference-attach-template-to-task-counts-by-status',
		resource: REFERENCES_ATTACH_TEMPLATE_TO_TASK_CONTROLLER.concat('/counts-by-status'),
		action: ResourceActions.READ,
	},
];
