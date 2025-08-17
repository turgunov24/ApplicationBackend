"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHandler = void 0;
const districts_1 = require("../../../db/schemas/districts");
const db_1 = __importDefault(require("../../../db"));
const drizzle_orm_1 = require("drizzle-orm");
const deleteHandler = async (req, res) => {
    try {
        const { id } = req.query;
        const result = await db_1.default
            .delete(districts_1.districtsTable)
            .where((0, drizzle_orm_1.eq)(districts_1.districtsTable.id, parseInt(String(id))))
            .returning();
        if (result.length === 0) {
            res.status(404).json({ message: 'District not found' });
        }
        else {
            res.json({ message: 'District deleted successfully' });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to delete district' });
    }
};
exports.deleteHandler = deleteHandler;
