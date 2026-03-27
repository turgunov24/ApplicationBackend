import { InferSelectModel } from 'drizzle-orm';
import { referencesPermissionsTable } from '../../schemas';
import { REFERENCES_TRANSLATIONS_CONTROLLER } from '../../../helpers/endPoints';
import { ResourceActions } from '../../../types/auth';

export const translationsPermissions: Array<
	Pick<
		InferSelectModel<typeof referencesPermissionsTable>,
		'nameRu' | 'nameUz' | 'resource' | 'action'
	>
> = [
	{
		nameUz: 'reference-translations-index',
		nameRu: 'reference-translations-index',
		resource: REFERENCES_TRANSLATIONS_CONTROLLER,
		action: ResourceActions.READ,
	},
	{
		nameUz: 'reference-translations-create',
		nameRu: 'reference-translations-create',
		resource: REFERENCES_TRANSLATIONS_CONTROLLER,
		action: ResourceActions.CREATE,
	},
	{
		nameUz: 'reference-translations-update',
		nameRu: 'reference-translations-update',
		resource: REFERENCES_TRANSLATIONS_CONTROLLER,
		action: ResourceActions.UPDATE,
	},
	{
		nameUz: 'reference-translations-delete',
		nameRu: 'reference-translations-delete',
		resource: REFERENCES_TRANSLATIONS_CONTROLLER,
		action: ResourceActions.DELETE,
	},
	{
		nameUz: 'reference-translations-list',
		nameRu: 'reference-translations-list',
		resource: REFERENCES_TRANSLATIONS_CONTROLLER.concat('/list'),
		action: ResourceActions.READ,
	},
	{
		nameUz: 'reference-translations-counts-by-status',
		nameRu: 'reference-translations-counts-by-status',
		resource: REFERENCES_TRANSLATIONS_CONTROLLER.concat('/counts-by-status'),
		action: ResourceActions.READ,
	},
	{
		nameUz: 'reference-translations-bundle',
		nameRu: 'reference-translations-bundle',
		resource: REFERENCES_TRANSLATIONS_CONTROLLER.concat('/bundle'),
		action: ResourceActions.READ,
	},
];
