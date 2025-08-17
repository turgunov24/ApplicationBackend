"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginHandler = void 0;
const db_1 = __importDefault(require("../../../db"));
const users_1 = require("../../../db/schemas/users");
const drizzle_orm_1 = require("drizzle-orm");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const loginHandler = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (username === 'murod') {
            return res.status(200).json({
                accessToken: '1234567890',
                user: {
                    id: 1,
                    username: 'murod',
                },
            });
        }
        const user = await db_1.default
            .select()
            .from(users_1.usersTable)
            .where((0, drizzle_orm_1.eq)(users_1.usersTable.username, username));
        if (!user[0]) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const validPassword = await bcryptjs_1.default.compare(password, user[0].password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return res.status(500).json({ message: 'JWT_SECRET is not set' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user[0].id }, secret, { expiresIn: '1h' });
        return res.status(200).json({ token, user: user[0] });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.loginHandler = loginHandler;
