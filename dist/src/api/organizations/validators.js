"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteValidator = exports.updateValidator = exports.createValidator = void 0;
const organizations_1 = require("../../db/schemas/organizations");
const express_validator_1 = require("express-validator");
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = __importDefault(require("../../db"));
const deleteSchema = {
    id: {
        in: 'query',
        isInt: true,
        notEmpty: true,
        errorMessage: 'Organization id is required',
        custom: {
            options: async (value) => {
                const place = await db_1.default
                    .select()
                    .from(organizations_1.organizationsTable)
                    .where((0, drizzle_orm_1.eq)(organizations_1.organizationsTable.id, value));
                if (!place.length)
                    throw new Error('Direction not found');
                return true;
            },
        },
    },
};
const createSchema = {
    name: {
        in: 'body',
        isString: true,
        notEmpty: true,
        errorMessage: 'Organization name is required',
        trim: true,
        custom: {
            options: async (value) => {
                const direction = await db_1.default
                    .select()
                    .from(organizations_1.organizationsTable)
                    .where((0, drizzle_orm_1.eq)(organizations_1.organizationsTable.name, value));
                if (direction.length > 0) {
                    throw new Error('Organization name already exists');
                }
                return true;
            },
        },
    },
};
const updateSchema = {
    ...createSchema,
    ...deleteSchema,
};
exports.createValidator = (0, express_validator_1.checkSchema)(createSchema);
exports.updateValidator = (0, express_validator_1.checkSchema)(updateSchema);
exports.deleteValidator = (0, express_validator_1.checkSchema)(deleteSchema);
