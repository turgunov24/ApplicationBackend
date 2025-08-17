"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteValidator = exports.updateValidator = exports.createValidator = void 0;
const users_1 = require("../../db/schemas/users");
const express_validator_1 = require("express-validator");
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = __importDefault(require("../../db"));
const deleteSchema = {
    id: {
        in: 'query',
        isInt: true,
        notEmpty: true,
        errorMessage: 'User id is required',
        custom: {
            options: async (value) => {
                const place = await db_1.default
                    .select()
                    .from(users_1.usersTable)
                    .where((0, drizzle_orm_1.eq)(users_1.usersTable.id, value));
                if (!place.length)
                    throw new Error('User not found');
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
        errorMessage: 'User name is required',
        trim: true,
        custom: {
            options: async (value) => {
                const user = await db_1.default
                    .select()
                    .from(users_1.usersTable)
                    .where((0, drizzle_orm_1.eq)(users_1.usersTable.username, value));
                if (user.length > 0) {
                    throw new Error('User name already exists');
                }
                return true;
            },
        },
    },
    username: {
        in: 'body',
        isString: true,
        notEmpty: true,
        errorMessage: 'User username is required',
        trim: true,
        custom: {
            options: async (value) => {
                const user = await db_1.default
                    .select()
                    .from(users_1.usersTable)
                    .where((0, drizzle_orm_1.eq)(users_1.usersTable.username, value));
                if (user.length > 0) {
                    throw new Error('User username already exists');
                }
                return true;
            },
        },
    },
    password: {
        in: 'body',
        isString: true,
        notEmpty: true,
        errorMessage: 'User password is required',
        trim: true,
        isLength: {
            options: {
                min: 8,
                max: 20,
            },
            errorMessage: 'Password must be between 8 and 20 characters',
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
