import referencesCountriesResources from '../api/core/references/countries/resources';
import referencesRegionsResources from '../api/core/references/regions/resources';
import referencesDistrictsResources from '../api/core/references/districts/resources';
import referencesRolesResources from '../api/core/references/roles/resources';
import referencesPermissionsResources from '../api/core/references/permissions/resources';
import referencesPermissionGroupsResources from '../api/core/references/permissionGroups/resources';
import referencesRolesPermissionsResources from '../api/core/references/rolesPermissions/resources';
import usersResources from '../api/core/users/resources';
import referencesResources from '../api/core/references/resources/resources';
import referencesCurrenciesResources from '../api/core/references/currencies/resources';
import referencesClientTypesResources from '../api/core/references/clientTypes/resources';
import referencesTariffsResources from '../api/core/references/tariffs/resources';
import principalsResources from '../api/core/principals/resources';

const resources = [
	...referencesClientTypesResources,
	...referencesCountriesResources,
	...referencesCurrenciesResources,
	...referencesDistrictsResources,
	...referencesTariffsResources,
	...referencesPermissionGroupsResources,
	...referencesPermissionsResources,
	...referencesRegionsResources,
	...referencesResources,
	...referencesRolesResources,
	...referencesRolesPermissionsResources,
	...usersResources,
	...principalsResources,
];

export default resources;
