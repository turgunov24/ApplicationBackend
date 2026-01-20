import { InferSelectModel } from 'drizzle-orm';
import { referencesPermissionsTable } from '../../schemas';
import { REFERENCES_TARIFFS_CONTROLLER } from '../../../helpers/endPoints';
import { ResourceActions } from '../../../types/auth';

export const tariffsPermissions: Array<
	Pick<
		InferSelectModel<typeof referencesPermissionsTable>,
		'nameRu' | 'nameUz' | 'resource' | 'action'
	>
> = [
	{
		nameUz: 'reference-tariffs-index',
		nameRu: 'reference-tariffs-index',
		resource: REFERENCES_TARIFFS_CONTROLLER,
		action: ResourceActions.READ,
	},
	{
		nameUz: 'reference-tariffs-create',
		nameRu: 'reference-tariffs-create',
		resource: REFERENCES_TARIFFS_CONTROLLER,
		action: ResourceActions.CREATE,
	},
	{
		nameUz: 'reference-tariffs-update',
		nameRu: 'reference-tariffs-update',
		resource: REFERENCES_TARIFFS_CONTROLLER,
		action: ResourceActions.UPDATE,
	},
	{
		nameUz: 'reference-tariffs-delete',
		nameRu: 'reference-tariffs-delete',
		resource: REFERENCES_TARIFFS_CONTROLLER,
		action: ResourceActions.DELETE,
	},
	{
		nameUz: 'reference-tariffs-list',
		nameRu: 'reference-tariffs-list',
		resource: REFERENCES_TARIFFS_CONTROLLER.concat('/list'),
		action: ResourceActions.READ,
	},
	{
		nameUz: 'reference-tariffs-counts-by-status',
		nameRu: 'reference-tariffs-counts-by-status',
		resource: REFERENCES_TARIFFS_CONTROLLER.concat('/counts-by-status'),
		action: ResourceActions.READ,
	},
];
