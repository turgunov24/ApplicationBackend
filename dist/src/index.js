"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const controller_1 = __importDefault(require("./api/users/controller"));
const endPoints_1 = require("./helpers/endPoints");
const cors_1 = __importDefault(require("cors"));
const logger_1 = require("./utils/logger");
const controller_2 = __importDefault(require("./api/organizations/controller"));
const controller_3 = __importDefault(require("./api/auth/login/controller"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3002;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API' });
});
// Use users router
app.use(endPoints_1.USERS_CONTROLLER, controller_1.default);
app.use(endPoints_1.ORGANIZATIONS_CONTROLLER, controller_2.default);
app.use(endPoints_1.AUTH_CONTROLLER, controller_3.default);
// Start the server
app.listen(port, () => {
    logger_1.logger.info(`Server is running on http://localhost:${port}`);
    // recoverBots()
});
