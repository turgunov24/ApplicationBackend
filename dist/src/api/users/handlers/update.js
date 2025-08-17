"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateHandler = void 0;
const users_1 = require("../../../db/schemas/users");
const db_1 = __importDefault(require("../../../db"));
const drizzle_orm_1 = require("drizzle-orm");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const updateHandler = async (req, res) => {
    try {
        const { id } = req.query;
        const { name, username, password } = req.body;
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        await db_1.default
            .update(users_1.usersTable)
            .set({ name, username, password: hashedPassword, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(users_1.usersTable.id, Number(id)))
            .returning();
        res.json({ message: 'User updated successfully' });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};
exports.updateHandler = updateHandler;
