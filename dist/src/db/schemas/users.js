"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersTable = exports.statuses = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const pg_core_2 = require("drizzle-orm/pg-core");
exports.statuses = ['active', 'pending', 'banned', 'rejected'];
exports.usersTable = (0, pg_core_2.pgTable)('users', {
    id: (0, pg_core_2.serial)().primaryKey().notNull(),
    name: (0, pg_core_2.varchar)({ length: 255 }).notNull(),
    createdAt: (0, pg_core_2.timestamp)().notNull().defaultNow(),
    updatedAt: (0, pg_core_2.timestamp)().notNull().defaultNow(),
    token: (0, pg_core_2.varchar)({ length: 500 }),
    password: (0, pg_core_2.varchar)({ length: 100 }).notNull(),
    username: (0, pg_core_2.varchar)({ length: 50 }).notNull().unique(),
    status: (0, pg_core_1.text)('status', { enum: exports.statuses }).notNull().default('pending'),
});
