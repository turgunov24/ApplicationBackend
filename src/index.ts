import 'dotenv/config';
import express from 'express';
import http from 'http';
import usersRouter from './api/users/controller';
import principalsRouter from './api/principals/controller';
import {
	AUTH_CONTROLLER,
	PRINCIPALS_CONTROLLER,
	REFERENCES_CLIENT_TYPES_CONTROLLER,
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
} from './helpers/endPoints';
import cors from 'cors';

import { logger } from './utils/logger';
import authRouter from './api/auth/login/controller';
import path from 'path';
import referencesCountriesRouter from './api/references/countries/controller';
import referencesRegionsRouter from './api/references/regions/controller';
import referencesDistrictsRouter from './api/references/districts/controller';
import referencesPermissionGroupsRouter from './api/references/permissionGroups/controller';
import referencesPermissionsRouter from './api/references/permissions/controller';
import referencesRolesRouter from './api/references/roles/controller';
import referencesRolesPermissionsRouter from './api/references/rolesPermissions/controller';
import referencesResourcesRouter from './api/references/resources/controller';
import referencesCurrenciesRouter from './api/references/currencies/controller';
import referencesClientTypesRouter from './api/references/clientTypes/controller';
import referencesTariffsRouter from './api/references/tariffs/controller';
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
	res.json({ message: 'Welcome to the API' });
});

// // Use users router
app.use(USERS_CONTROLLER, usersRouter);
app.use(PRINCIPALS_CONTROLLER, principalsRouter);
app.use(AUTH_CONTROLLER, authRouter);
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
app.use('/swagger', swaggerServe, swaggerSetup);

// Start the server
server.listen(port, () => {
	logger.info(`Server is running on http://localhost:${port}`);
	initializeWebSocket();
});
