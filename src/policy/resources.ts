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
import principalCustomersResources from '../api/core/principalCustomers/resources';
import referencesCounterpartiesResources from '../api/core/references/counterparties/resources';
import referencesLegalFormsResources from '../api/core/references/legalForms/resources';
import referencesServicesResources from '../api/core/references/services/resources';
import attachTariffToPrincipalCustomersResources from '../api/core/attachTariffToPrincipalCustomers/resources';
import principalCustomerCredentialsResources from '../api/core/references/principalCustomerCredentials/resources';
import referencesTranslationsResources from '../api/core/references/translations/resources';
import referencesUserTranslationsResources from '../api/core/references/userTranslations/resources';

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
	...principalCustomersResources,
	...referencesCounterpartiesResources,
	...referencesLegalFormsResources,
	...referencesServicesResources,
	...attachTariffToPrincipalCustomersResources,
	...principalCustomerCredentialsResources,
	...referencesTranslationsResources,
	...referencesUserTranslationsResources,
];

export default resources;
