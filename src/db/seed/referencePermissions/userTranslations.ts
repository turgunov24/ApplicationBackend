import { InferSelectModel } from 'drizzle-orm';
import { referencesPermissionsTable } from '../../schemas';
import { REFERENCES_USER_TRANSLATIONS_CONTROLLER } from '../../../helpers/endPoints';
import { ResourceActions } from '../../../types/auth';

export const userTranslationsPermissions: Array<
	Pick<
		InferSelectModel<typeof referencesPermissionsTable>,
		'nameRu' | 'nameUz' | 'resource' | 'action'
	>
> = [
	{
		nameUz: 'reference-user-translations-index',
		nameRu: 'reference-user-translations-index',
		resource: REFERENCES_USER_TRANSLATIONS_CONTROLLER,
		action: ResourceActions.READ,
	},
	{
		nameUz: 'reference-user-translations-create',
		nameRu: 'reference-user-translations-create',
		resource: REFERENCES_USER_TRANSLATIONS_CONTROLLER,
		action: ResourceActions.CREATE,
	},
	{
		nameUz: 'reference-user-translations-update',
		nameRu: 'reference-user-translations-update',
		resource: REFERENCES_USER_TRANSLATIONS_CONTROLLER,
		action: ResourceActions.UPDATE,
	},
	{
		nameUz: 'reference-user-translations-delete',
		nameRu: 'reference-user-translations-delete',
		resource: REFERENCES_USER_TRANSLATIONS_CONTROLLER,
		action: ResourceActions.DELETE,
	},
];
