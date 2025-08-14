import { pgTable, varchar, timestamp, serial } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp().notNull().defaultNow(),
	token: varchar({ length: 500 }),
	password: varchar({ length: 100 }).notNull(),
	username: varchar({ length: 50 }).notNull().unique(),
});
