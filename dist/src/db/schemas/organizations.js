"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.organizationsTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.organizationsTable = (0, pg_core_1.pgTable)('organizations', {
    id: (0, pg_core_1.serial)().primaryKey().notNull(),
    name: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
    createdAt: (0, pg_core_1.timestamp)().notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)().notNull().defaultNow(),
    token: (0, pg_core_1.varchar)({ length: 500 }).notNull().unique(),
});
