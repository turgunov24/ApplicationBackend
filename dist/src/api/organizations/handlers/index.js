"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexHandler = void 0;
const db_1 = __importDefault(require("../../../db"));
const organizations_1 = require("../../../db/schemas/organizations");
const indexHandler = async (req, res) => {
    try {
        const result = await db_1.default.select().from(organizations_1.organizationsTable);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch organizations' });
    }
};
exports.indexHandler = indexHandler;
