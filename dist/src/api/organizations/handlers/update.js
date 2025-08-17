"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateHandler = void 0;
const organizations_1 = require("../../../db/schemas/organizations");
const db_1 = __importDefault(require("../../../db"));
const drizzle_orm_1 = require("drizzle-orm");
const updateHandler = async (req, res) => {
    try {
        const { id } = req.query;
        const { name } = req.body;
        await db_1.default
            .update(organizations_1.organizationsTable)
            .set({ name, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(organizations_1.organizationsTable.id, Number(id)))
            .returning();
        res.json({ message: 'District updated successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update district' });
    }
};
exports.updateHandler = updateHandler;
