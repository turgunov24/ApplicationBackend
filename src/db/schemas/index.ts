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
export {
	referencesCurrenciesTable,
	referencesCurrenciesRelations,
} from './references/currencies';
export {
	referencesCounterpartiesTable,
	referencesCounterpartiesRelations,
} from './references/counterparties';
export {
	referencesLegalFormsTable,
	referencesLegalFormsRelations,
} from './references/legalForms';
export {
	referencesServicesTable,
	referencesServicesRelations,
} from './references/services';
export {
	referencesClientTypesTable,
	referencesClientTypesRelations,
} from './references/clientTypes';
export {
	referencesTariffsTable,
	referencesTariffsRelations,
} from './references/tariffs';
export { principalsTable, principalsRelations } from './principals';
export {
	principalCustomersTable,
	principalCustomersRelations,
} from './principalCustomers';
export {
	referencesPrincipalCustomerCredentialsTable,
	referencesPrincipalCustomerCredentialsRelations,
} from './references/principalCustomerCredentials';
export {
	referencesAttachTariffToPrincipalCustomersTable,
	referencesAttachTariffToPrincipalCustomersRelations,
} from './references/attachTariffToPrincipalCustomers';
export {
	referencesTasksTable,
	referencesTasksRelations,
} from './references/tasks';
export {
	referencesTasksCommentsTable,
	referencesTasksCommentsRelations,
} from './references/tasksComments';
export {
	referencesTaskActionsHistoryTable,
	referencesTaskActionsHistoryRelations,
} from './references/taskActionsHistory';
export {
	referencesTaskTemplatesTable,
	referencesTaskTemplatesRelations,
} from './references/taskTemplates';
export {
	referencesTaskTemplateCategoriesTable,
	referencesTaskTemplateCategoriesRelations,
} from './references/taskTemplateCategories';
export {
	referencesTaskRecurrenceTable,
	referencesTaskRecurrenceRelations,
} from './references/taskRecurrence';
export {
	referencesTranslationsTable,
	referencesTranslationsRelations,
} from './references/translations';
export {
	referencesUserTranslationsTable,
	referencesUserTranslationsRelations,
} from './references/userTranslations';
