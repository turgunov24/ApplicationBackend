"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const handlers_1 = require("./handlers");
const withValidationErrors_1 = require("../../middlewares/withValidationErrors");
const create_1 = require("./handlers/create");
const validators_1 = require("./validators");
const router = (0, express_1.Router)();
router.get('/', handlers_1.indexHandler);
router.post('/', validators_1.createValidator, withValidationErrors_1.withValidationErrorsMiddleware, create_1.createHandler);
// router.put('/', updateValidator, withValidationErrorsMiddleware, updateHandler);
// router.delete(
// 	'/',
// 	deleteValidator,
// 	withValidationErrorsMiddleware,
// 	deleteHandler
// );
exports.default = router;
