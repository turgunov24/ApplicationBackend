import 'dotenv/config';
import express from 'express';
import http from 'http';
import usersRouter from './api/core/users/controller';
import principalsRouter from './api/core/principals/controller';
import {
	AUTH_CONTROLLER,
	AUTH_PRINCIPALS_CONTROLLER,
	PRINCIPALS_CONTROLLER,
	PRINCIPAL_CUSTOMERS_CONTROLLER,
	PRINCIPALS_CLIENT_TYPES_CONTROLLER,
	PRINCIPALS_PRINCIPAL_CUSTOMERS_CONTROLLER,
	PRINCIPALS_COUNTERPARTIES_CONTROLLER,
	PRINCIPALS_LEGAL_FORMS_CONTROLLER,
	REFERENCES_CLIENT_TYPES_CONTROLLER,
	REFERENCES_COUNTERPARTIES_CONTROLLER,
	REFERENCES_LEGAL_FORMS_CONTROLLER,
	REFERENCES_SERVICES_CONTROLLER,
	PRINCIPALS_SERVICES_CONTROLLER,
	REFERENCES_PRINCIPAL_CUSTOMER_CREDENTIALS_CONTROLLER,
	PRINCIPALS_PRINCIPAL_CUSTOMER_CREDENTIALS_CONTROLLER,
	REFERENCES_COUNTRIES_CONTROLLER,
	REFERENCES_CURRENCIES_CONTROLLER,
	REFERENCES_DISTRICTS_CONTROLLER,
	REFERENCES_PERMISSION_GROUPS_CONTROLLER,
	REFERENCES_PERMISSIONS_CONTROLLER,
	REFERENCES_REGIONS_CONTROLLER,
	REFERENCES_RESOURCES_CONTROLLER,
	REFERENCES_ROLES_CONTROLLER,
	REFERENCES_ROLES_PERMISSIONS_CONTROLLER,
	REFERENCES_TARIFFS_CONTROLLER,
	USERS_CONTROLLER,
	ATTACH_TARIFF_TO_PRINCIPAL_CUSTOMERS_CONTROLLER,
	PRINCIPALS_ATTACH_TARIFF_TO_PRINCIPAL_CUSTOMERS_CONTROLLER,
	PRINCIPALS_TARIFFS_CONTROLLER,
	PRINCIPALS_CURRENCIES_CONTROLLER,
	REFERENCES_TRANSLATIONS_CONTROLLER,
	REFERENCES_USER_TRANSLATIONS_CONTROLLER,
} from './helpers/endPoints';
import cors from 'cors';

import { logger } from './utils/logger';
import authRouter from './api/core/auth/controller';
import authPrincipalsRouter from './api/principals/auth/controller';
import path from 'path';
import referencesCountriesRouter from './api/core/references/countries/controller';
import referencesRegionsRouter from './api/core/references/regions/controller';
import referencesDistrictsRouter from './api/core/references/districts/controller';
import referencesPermissionGroupsRouter from './api/core/references/permissionGroups/controller';
import referencesPermissionsRouter from './api/core/references/permissions/controller';
import referencesRolesRouter from './api/core/references/roles/controller';
import referencesRolesPermissionsRouter from './api/core/references/rolesPermissions/controller';
import referencesResourcesRouter from './api/core/references/resources/controller';
import referencesCurrenciesRouter from './api/core/references/currencies/controller';
import referencesClientTypesRouter from './api/core/references/clientTypes/controller';
import referencesTariffsRouter from './api/core/references/tariffs/controller';
import principalCustomersRouter from './api/core/principalCustomers/controller';
import principalsClientTypesRouter from './api/principals/clientTypes/controller';
import principalsPrincipalCustomersRouter from './api/principals/principalCustomers/controller';
import referencesCounterpartiesRouter from './api/core/references/counterparties/controller';
import principalsCounterpartiesRouter from './api/principals/counterparties/controller';
import referencesLegalFormsRouter from './api/core/references/legalForms/controller';
import principalsLegalFormsRouter from './api/principals/legalForms/controller';
import referencesServicesRouter from './api/core/references/services/controller';
import principalsServicesRouter from './api/principals/services/controller';
import referencesPrincipalCustomerCredentialsRouter from './api/core/references/principalCustomerCredentials/controller';
import principalsPrincipalCustomerCredentialsRouter from './api/principals/principalCustomerCredentials/controller';
import attachTariffToPrincipalCustomersRouter from './api/core/attachTariffToPrincipalCustomers/controller';
import principalsAttachTariffToPrincipalCustomersRouter from './api/principals/attachTariffToPrincipalCustomers/controller';
import principalsTariffsRouter from './api/principals/tariffs/controller';
import principalsCurrenciesRouter from './api/principals/currencies/controller';
import referencesTranslationsRouter from './api/core/references/translations/controller';
import referencesUserTranslationsRouter from './api/core/references/userTranslations/controller';
import { swaggerServe, swaggerSetup } from './api/swagger/index';
import { initializeWebSocket } from './websocket';

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3001;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
	cors({
		origin: '*',
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	}),
);

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Basic route
app.get('/', (req, res) => {
	res.json({
		message: 'Welcome to the API',
		dbName: process.env.DB_NAME,
		dbPort: process.env.DB_PORT,
		port,
	});
});

// // Use users router
app.use(USERS_CONTROLLER, usersRouter);
app.use(PRINCIPALS_CONTROLLER, principalsRouter);
app.use(AUTH_CONTROLLER, authRouter);
app.use(AUTH_PRINCIPALS_CONTROLLER, authPrincipalsRouter);
app.use(REFERENCES_COUNTRIES_CONTROLLER, referencesCountriesRouter);
app.use(REFERENCES_REGIONS_CONTROLLER, referencesRegionsRouter);
app.use(REFERENCES_DISTRICTS_CONTROLLER, referencesDistrictsRouter);
app.use(
	REFERENCES_PERMISSION_GROUPS_CONTROLLER,
	referencesPermissionGroupsRouter,
);
app.use(REFERENCES_PERMISSIONS_CONTROLLER, referencesPermissionsRouter);
app.use(REFERENCES_ROLES_CONTROLLER, referencesRolesRouter);
app.use(
	REFERENCES_ROLES_PERMISSIONS_CONTROLLER,
	referencesRolesPermissionsRouter,
);
app.use(REFERENCES_RESOURCES_CONTROLLER, referencesResourcesRouter);
app.use(REFERENCES_CURRENCIES_CONTROLLER, referencesCurrenciesRouter);
app.use(REFERENCES_CLIENT_TYPES_CONTROLLER, referencesClientTypesRouter);
app.use(REFERENCES_TARIFFS_CONTROLLER, referencesTariffsRouter);
app.use(PRINCIPAL_CUSTOMERS_CONTROLLER, principalCustomersRouter);
app.use(PRINCIPALS_CLIENT_TYPES_CONTROLLER, principalsClientTypesRouter);
app.use(
	PRINCIPALS_PRINCIPAL_CUSTOMERS_CONTROLLER,
	principalsPrincipalCustomersRouter,
);
app.use(REFERENCES_COUNTERPARTIES_CONTROLLER, referencesCounterpartiesRouter);
app.use(PRINCIPALS_COUNTERPARTIES_CONTROLLER, principalsCounterpartiesRouter);
app.use(REFERENCES_LEGAL_FORMS_CONTROLLER, referencesLegalFormsRouter);
app.use(PRINCIPALS_LEGAL_FORMS_CONTROLLER, principalsLegalFormsRouter);
app.use(REFERENCES_SERVICES_CONTROLLER, referencesServicesRouter);
app.use(PRINCIPALS_SERVICES_CONTROLLER, principalsServicesRouter);
app.use(
	REFERENCES_PRINCIPAL_CUSTOMER_CREDENTIALS_CONTROLLER,
	referencesPrincipalCustomerCredentialsRouter,
);
app.use(
	PRINCIPALS_PRINCIPAL_CUSTOMER_CREDENTIALS_CONTROLLER,
	principalsPrincipalCustomerCredentialsRouter,
);
app.use(
	ATTACH_TARIFF_TO_PRINCIPAL_CUSTOMERS_CONTROLLER,
	attachTariffToPrincipalCustomersRouter,
);
app.use(
	PRINCIPALS_ATTACH_TARIFF_TO_PRINCIPAL_CUSTOMERS_CONTROLLER,
	principalsAttachTariffToPrincipalCustomersRouter,
);
app.use(PRINCIPALS_TARIFFS_CONTROLLER, principalsTariffsRouter);
app.use(PRINCIPALS_CURRENCIES_CONTROLLER, principalsCurrenciesRouter);
app.use(REFERENCES_TRANSLATIONS_CONTROLLER, referencesTranslationsRouter);
app.use(
	REFERENCES_USER_TRANSLATIONS_CONTROLLER,
	referencesUserTranslationsRouter,
);
app.use('/swagger', swaggerServe, swaggerSetup);

// Start the server
server.listen(port, () => {
	logger.info(`Server is running on http://localhost:${port}`);
	initializeWebSocket();
});
