"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidator = exports.loginSchema = void 0;
const express_validator_1 = require("express-validator");
exports.loginSchema = {
    username: {
        in: 'body',
        isString: true,
        isLength: {
            options: { min: 3, max: 50 },
            errorMessage: 'Username must be between 3 and 50 characters',
        },
        notEmpty: true,
        errorMessage: 'Username is required',
    },
    password: {
        in: 'body',
        isString: true,
        isLength: {
            options: { min: 4, max: 20 },
            errorMessage: 'Password must be between 4 and 20 characters',
        },
        notEmpty: true,
        errorMessage: 'Password is required',
    },
};
exports.loginValidator = (0, express_validator_1.checkSchema)(exports.loginSchema);
