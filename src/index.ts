import 'dotenv/config';
import express from 'express';
import usersRouter from './api/users/controller';
import {
	AUTH_CONTROLLER,
	REFERENCES_COUNTRIES_CONTROLLER,
	REFERENCES_DISTRICTS_CONTROLLER,
	REFERENCES_PERMISSION_GROUPS_CONTROLLER,
	REFERENCES_PERMISSIONS_CONTROLLER,
	REFERENCES_REGIONS_CONTROLLER,
	REFERENCES_ROLES_CONTROLLER,
	REFERENCES_ROLES_PERMISSIONS_CONTROLLER,
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

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(
	cors({
		origin: '*',
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	})
);

// Basic route
app.get('/', (req, res) => {
	res.json({ message: 'Welcome to the API' });
});

// Use users router
app.use(USERS_CONTROLLER, usersRouter);
app.use(AUTH_CONTROLLER, authRouter);
app.use(REFERENCES_COUNTRIES_CONTROLLER, referencesCountriesRouter);
app.use(REFERENCES_REGIONS_CONTROLLER, referencesRegionsRouter);
app.use(REFERENCES_DISTRICTS_CONTROLLER, referencesDistrictsRouter);
app.use(
	REFERENCES_PERMISSION_GROUPS_CONTROLLER,
	referencesPermissionGroupsRouter
);
app.use(REFERENCES_PERMISSIONS_CONTROLLER, referencesPermissionsRouter);
app.use(REFERENCES_ROLES_CONTROLLER, referencesRolesRouter);
app.use(
	REFERENCES_ROLES_PERMISSIONS_CONTROLLER,
	referencesRolesPermissionsRouter
);

// Start the server
app.listen(port, () => {
	logger.info(`Server is running on http://localhost:${port}`);
	// recoverBots()
});
