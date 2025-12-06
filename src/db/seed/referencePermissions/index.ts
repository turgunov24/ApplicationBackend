import { InferSelectModel } from 'drizzle-orm';
import * as schemas from '../../schemas/index';
import { countriesPermissions } from './countries';
import { districtsPermissions } from './districts';
import { regionsPermissions } from './regions';
import { rolesPermissions } from './roles';
import { permissionGroupsPermissions } from './permissionGroups';
import { permissionsPermissions } from './permissions';
import { rolesPermissionsPermissions } from './rolesPermissions';
import { usersPermissions } from './users';

export const permissions: Array<
	Pick<
		InferSelectModel<typeof schemas.referencesPermissionsTable>,
		'nameRu' | 'nameUz' | 'resource' | 'action'
	>
> = [
	...countriesPermissions,
	...districtsPermissions,
	...regionsPermissions,
	...rolesPermissions,
	...permissionGroupsPermissions,
	...permissionsPermissions,
	...rolesPermissionsPermissions,
	...usersPermissions,
];
