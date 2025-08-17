import 'dotenv/config';
import express from 'express';
import usersRouter from './api/users/controller';
import {
	AUTH_CONTROLLER,
	ORGANIZATIONS_CONTROLLER,
	USERS_CONTROLLER,
} from './helpers/endPoints';
import cors from 'cors';

import { logger } from './utils/logger';
import organizationsRouter from './api/organizations/controller';
import authRouter from './api/auth/login/controller';

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
app.use(ORGANIZATIONS_CONTROLLER, organizationsRouter);
app.use(AUTH_CONTROLLER, authRouter);

// Start the server
app.listen(port, () => {
	logger.info(`Server is running on http://localhost:${port}`);
	// recoverBots()
});
