import referencesCountriesResources from '../api/references/countries/resources';
import referencesRegionsResources from '../api/references/regions/resources';
import referencesDistrictsResources from '../api/references/districts/resources';
import referencesRolesResources from '../api/references/roles/resources';
import referencesPermissionsResources from '../api/references/permissions/resources';
import referencesPermissionGroupsResources from '../api/references/permissionGroups/resources';
import referencesRolesPermissionsResources from '../api/references/rolesPermissions/resources';
import usersResources from '../api/users/resources';
import referencesResources from '../api/references/resources/resources';
import referencesCurrenciesResources from '../api/references/currencies/resources';
import referencesClientTypesResources from '../api/references/clientTypes/resources';
import referencesTariffsResources from '../api/references/tariffs/resources';

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
];

export default resources;
