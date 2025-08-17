"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHandler = void 0;
const db_1 = __importDefault(require("../../../db"));
const organizations_1 = require("../../../db/schemas/organizations");
const createHandler = async (req, res) => {
    try {
        const { name } = req.body;
        const result = await db_1.default
            .insert(organizations_1.organizationsTable)
            .values({ name, token: 'sdf' })
            .returning();
        res.status(201).json(result[0]);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to create district' });
    }
};
exports.createHandler = createHandler;
