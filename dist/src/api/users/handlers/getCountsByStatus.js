"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCountsByStatusHandler = void 0;
const db_1 = __importDefault(require("../../../db"));
const users_1 = require("../../../db/schemas/users");
const drizzle_orm_1 = require("drizzle-orm");
const getCountsByStatusHandler = async (req, res) => {
    try {
        // Get total count
        const totalCountResult = await db_1.default
            .select({ count: (0, drizzle_orm_1.count)() })
            .from(users_1.usersTable);
        const totalCount = totalCountResult[0].count;
        // Get count for each status
        const statusCounts = {
            all: totalCount,
        };
        for (const status of users_1.statuses) {
            const statusCountResult = await db_1.default
                .select({ count: (0, drizzle_orm_1.count)() })
                .from(users_1.usersTable)
                .where((0, drizzle_orm_1.eq)(users_1.usersTable.status, status));
            statusCounts[status] = statusCountResult[0].count;
        }
        res.json(statusCounts);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};
exports.getCountsByStatusHandler = getCountsByStatusHandler;
