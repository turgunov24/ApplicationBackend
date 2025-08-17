"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHandler = void 0;
const db_1 = __importDefault(require("../../../db"));
const users_1 = require("../../../db/schemas/users");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const createHandler = async (req, res) => {
    try {
        const { name, username, password } = req.body;
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const result = await db_1.default
            .insert(users_1.usersTable)
            .values({
            name,
            username,
            password: hashedPassword,
        })
            .returning();
        res.status(201).json(result[0]);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'Internal server error' });
        }
        console.log(error);
    }
};
exports.createHandler = createHandler;
