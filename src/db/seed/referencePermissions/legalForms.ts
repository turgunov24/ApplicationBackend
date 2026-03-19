import { InferSelectModel } from 'drizzle-orm';
import { referencesPermissionsTable } from '../../schemas';
import { REFERENCES_LEGAL_FORMS_CONTROLLER } from '../../../helpers/endPoints';
import { ResourceActions } from '../../../types/auth';

export const legalFormsPermissions: Array<
	Pick<
		InferSelectModel<typeof referencesPermissionsTable>,
		'nameRu' | 'nameUz' | 'resource' | 'action'
	>
> = [
	{
		nameUz: 'reference-legal-forms-index',
		nameRu: 'reference-legal-forms-index',
		resource: REFERENCES_LEGAL_FORMS_CONTROLLER,
		action: ResourceActions.READ,
	},
	{
		nameUz: 'reference-legal-forms-create',
		nameRu: 'reference-legal-forms-create',
		resource: REFERENCES_LEGAL_FORMS_CONTROLLER,
		action: ResourceActions.CREATE,
	},
	{
		nameUz: 'reference-legal-forms-update',
		nameRu: 'reference-legal-forms-update',
		resource: REFERENCES_LEGAL_FORMS_CONTROLLER,
		action: ResourceActions.UPDATE,
	},
	{
		nameUz: 'reference-legal-forms-delete',
		nameRu: 'reference-legal-forms-delete',
		resource: REFERENCES_LEGAL_FORMS_CONTROLLER,
		action: ResourceActions.DELETE,
	},
	{
		nameUz: 'reference-legal-forms-list',
		nameRu: 'reference-legal-forms-list',
		resource: REFERENCES_LEGAL_FORMS_CONTROLLER.concat('/list'),
		action: ResourceActions.READ,
	},
	{
		nameUz: 'reference-legal-forms-counts-by-status',
		nameRu: 'reference-legal-forms-counts-by-status',
		resource: REFERENCES_LEGAL_FORMS_CONTROLLER.concat('/counts-by-status'),
		action: ResourceActions.READ,
	},
];
