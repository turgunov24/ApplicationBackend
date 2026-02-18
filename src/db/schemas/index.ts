// Export all database table schemas for Drizzle migrations
export { usersTable, usersRelations } from './users';
export { usersRolesTable, usersRolesRelations } from './usersRoles';
export {
	referencesCountriesTable,
	referencesCountriesRelations,
} from './references/countries';
export {
	referencesRegionsTable,
	referencesRegionsRelations,
} from './references/regions';
export {
	referencesDistrictsTable,
	referencesDistrictsRelations,
} from './references/districts';
export {
	referencesPermissionGroupsTable,
	referencesPermissionGroupsRelations,
} from './references/permissionGroups';
export {
	referencesPermissionsTable,
	referencesPermissionsRelations,
} from './references/permissions';
export {
	referencesRolesTable,
	referenceRolesRelations,
} from './references/roles';
export {
	referencesRolesPermissionsTable,
	referenceRolesPermissionsRelations,
} from './references/rolesPermissions';
export { referencesCurrenciesTable } from './references/currencies';
export { referencesClientTypesTable } from './references/clientTypes';
export {
	referencesTariffsTable,
	referencesTariffsRelations,
} from './references/tariffs';
export { principalsTable } from './principals';
export { principalCustomersTable } from './principalCustomers';
