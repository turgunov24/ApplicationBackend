"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHandler = void 0;
const users_1 = require("../../../db/schemas/users");
const db_1 = __importDefault(require("../../../db"));
const drizzle_orm_1 = require("drizzle-orm");
const deleteHandler = async (req, res) => {
    try {
        const { id } = req.query;
        const result = await db_1.default
            .delete(users_1.usersTable)
            .where((0, drizzle_orm_1.eq)(users_1.usersTable.id, Number(id)))
            .returning();
        if (result.length === 0) {
            res.status(404).json({ message: 'User not found' });
        }
        else {
            res.json({ message: 'User deleted successfully' });
        }
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
exports.deleteHandler = deleteHandler;
