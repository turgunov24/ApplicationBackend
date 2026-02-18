import { InferSelectModel } from 'drizzle-orm';
import * as schemas from '../../schemas/index';
import { countriesPermissions } from './countries';
import { clientTypesPermissions } from './clientTypes';
import { currenciesPermissions } from './currencies';
import { tariffsPermissions } from './tariffs';
import { districtsPermissions } from './districts';
import { regionsPermissions } from './regions';
import { rolesPermissions } from './roles';
import { permissionGroupsPermissions } from './permissionGroups';
import { permissionsPermissions } from './permissions';
import { rolesPermissionsPermissions } from './rolesPermissions';
import { usersPermissions } from './users';
import { principalsPermissions } from './principals';
import { principalCustomersPermissions } from './principalCustomers';
import { resourcesPermissions } from './resources';

export const permissions: Array<
	Pick<
		InferSelectModel<typeof schemas.referencesPermissionsTable>,
		'nameRu' | 'nameUz' | 'resource' | 'action'
	>
> = [
	...clientTypesPermissions,
	...countriesPermissions,
	...currenciesPermissions,
	...tariffsPermissions,
	...districtsPermissions,
	...regionsPermissions,
	...rolesPermissions,
	...permissionGroupsPermissions,
	...permissionsPermissions,
	...rolesPermissionsPermissions,
	...usersPermissions,
	...principalsPermissions,
	...principalCustomersPermissions,
	...resourcesPermissions,
];
