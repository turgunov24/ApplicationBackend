import { InferSelectModel } from 'drizzle-orm';
import { referencesPermissionsTable } from '../../schemas';
import { REFERENCES_COUNTERPARTIES_CONTROLLER } from '../../../helpers/endPoints';
import { ResourceActions } from '../../../types/auth';

export const counterpartiesPermissions: Array<
	Pick<
		InferSelectModel<typeof referencesPermissionsTable>,
		'nameRu' | 'nameUz' | 'resource' | 'action'
	>
> = [
	{
		nameUz: 'reference-counterparties-index',
		nameRu: 'reference-counterparties-index',
		resource: REFERENCES_COUNTERPARTIES_CONTROLLER,
		action: ResourceActions.READ,
	},
	{
		nameUz: 'reference-counterparties-create',
		nameRu: 'reference-counterparties-create',
		resource: REFERENCES_COUNTERPARTIES_CONTROLLER,
		action: ResourceActions.CREATE,
	},
	{
		nameUz: 'reference-counterparties-update',
		nameRu: 'reference-counterparties-update',
		resource: REFERENCES_COUNTERPARTIES_CONTROLLER,
		action: ResourceActions.UPDATE,
	},
	{
		nameUz: 'reference-counterparties-delete',
		nameRu: 'reference-counterparties-delete',
		resource: REFERENCES_COUNTERPARTIES_CONTROLLER,
		action: ResourceActions.DELETE,
	},
	{
		nameUz: 'reference-counterparties-list',
		nameRu: 'reference-counterparties-list',
		resource: REFERENCES_COUNTERPARTIES_CONTROLLER.concat('/list'),
		action: ResourceActions.READ,
	},
	{
		nameUz: 'reference-counterparties-counts-by-status',
		nameRu: 'reference-counterparties-counts-by-status',
		resource: REFERENCES_COUNTERPARTIES_CONTROLLER.concat('/counts-by-status'),
		action: ResourceActions.READ,
	},
];
