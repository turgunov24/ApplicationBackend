import { InferSelectModel } from 'drizzle-orm';
import { referencesPermissionsTable } from '../../schemas';
import { REFERENCES_SERVICES_CONTROLLER } from '../../../helpers/endPoints';
import { ResourceActions } from '../../../types/auth';

export const servicesPermissions: Array<
	Pick<
		InferSelectModel<typeof referencesPermissionsTable>,
		'nameRu' | 'nameUz' | 'resource' | 'action'
	>
> = [
	{
		nameUz: 'reference-services-index',
		nameRu: 'reference-services-index',
		resource: REFERENCES_SERVICES_CONTROLLER,
		action: ResourceActions.READ,
	},
	{
		nameUz: 'reference-services-create',
		nameRu: 'reference-services-create',
		resource: REFERENCES_SERVICES_CONTROLLER,
		action: ResourceActions.CREATE,
	},
	{
		nameUz: 'reference-services-update',
		nameRu: 'reference-services-update',
		resource: REFERENCES_SERVICES_CONTROLLER,
		action: ResourceActions.UPDATE,
	},
	{
		nameUz: 'reference-services-delete',
		nameRu: 'reference-services-delete',
		resource: REFERENCES_SERVICES_CONTROLLER,
		action: ResourceActions.DELETE,
	},
	{
		nameUz: 'reference-services-list',
		nameRu: 'reference-services-list',
		resource: REFERENCES_SERVICES_CONTROLLER.concat('/list'),
		action: ResourceActions.READ,
	},
	{
		nameUz: 'reference-services-counts-by-status',
		nameRu: 'reference-services-counts-by-status',
		resource: REFERENCES_SERVICES_CONTROLLER.concat('/counts-by-status'),
		action: ResourceActions.READ,
	},
];
