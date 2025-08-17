"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexHandler = void 0;
const db_1 = __importDefault(require("../../../db"));
const users_1 = require("../../../db/schemas/users");
const drizzle_orm_1 = require("drizzle-orm");
const drizzle_orm_2 = require("drizzle-orm");
const drizzle_orm_3 = require("drizzle-orm");
const drizzle_orm_4 = require("drizzle-orm");
const drizzle_orm_5 = require("drizzle-orm");
const drizzle_orm_6 = require("drizzle-orm");
const indexHandler = async (req, res) => {
    try {
        const { currentPage = '0', dataPerPage = '10', search, sortBy = 'createdAt', sortOrder = 'desc', status = 'all', } = req.query;
        const _currentPage = Math.max(0, parseInt(currentPage));
        const _dataPerPage = Math.min(100, Math.max(0, parseInt(dataPerPage)));
        const offset = _currentPage * _dataPerPage;
        const whereConditions = [];
        if (status !== 'all') {
            whereConditions.push((0, drizzle_orm_1.eq)(users_1.usersTable.status, status));
        }
        if (search) {
            const searchTerm = `%${search}%`;
            whereConditions.push((0, drizzle_orm_1.or)((0, drizzle_orm_2.ilike)(users_1.usersTable.name, searchTerm), (0, drizzle_orm_2.ilike)(users_1.usersTable.username, searchTerm)));
        }
        const whereClause = whereConditions.length > 0 ? (0, drizzle_orm_3.and)(...whereConditions) : undefined;
        const orderBy = sortOrder === 'asc' ? (0, drizzle_orm_5.asc)(users_1.usersTable[sortBy]) : (0, drizzle_orm_6.desc)(users_1.usersTable[sortBy]);
        const totalCountResult = await db_1.default
            .select({ count: (0, drizzle_orm_4.count)() })
            .from(users_1.usersTable)
            .where(whereClause);
        const totalCount = totalCountResult[0].count;
        const users = await db_1.default
            .select()
            .from(users_1.usersTable)
            .where(whereClause)
            .orderBy(orderBy)
            .limit(_dataPerPage)
            .offset(offset);
        const totalPages = Math.ceil(totalCount / _dataPerPage);
        const hasNextPage = _currentPage < totalPages;
        const hasPrevPage = _currentPage > 0;
        res.json({
            result: users,
            pagination: {
                currentPage: _currentPage,
                dataPerPage: _dataPerPage,
                totalData: totalCount,
                totalPages: totalPages,
                hasNextPage,
                hasPrevPage,
            },
        });
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
exports.indexHandler = indexHandler;
