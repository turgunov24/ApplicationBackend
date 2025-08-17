"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Make sure to install the 'pg' package
const node_postgres_1 = require("drizzle-orm/node-postgres");
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
const db = (0, node_postgres_1.drizzle)(pool, { casing: 'camelCase' });
exports.default = db;
