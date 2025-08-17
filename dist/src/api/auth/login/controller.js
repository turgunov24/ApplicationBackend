"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const handlers_1 = require("./handlers");
const validator_1 = require("./validator");
const withValidationErrors_1 = require("../../../middlewares/withValidationErrors");
const router = (0, express_1.Router)();
router.post('/login', validator_1.loginValidator, withValidationErrors_1.withValidationErrorsMiddleware, handlers_1.loginHandler);
exports.default = router;
