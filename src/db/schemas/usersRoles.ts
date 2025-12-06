import {
	pgTable,
	timestamp,
	serial,
	integer,
	unique,
} from 'drizzle-orm/pg-core';
import { usersTable } from './users';
import { referencesRolesTable } from './references/roles';
import { primaryKey } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const usersRolesTable = pgTable(
	'users_roles',
	{
		id: serial().primaryKey().notNull(),
		userId: integer('user_id')
			.notNull()
			.references(() => usersTable.id, { onDelete: 'cascade' }),
		roleId: integer('role_id')
			.notNull()
			.references(() => referencesRolesTable.id, { onDelete: 'cascade' }),
		createdAt: timestamp().notNull().defaultNow(),
		updatedAt: timestamp().notNull().defaultNow(),
	},
	(t) => [primaryKey({ columns: [t.userId, t.roleId] })]
);

export const usersRolesRelations = relations(
	usersRolesTable,
	({ one }) => ({
		role: one(referencesRolesTable, {
			fields: [usersRolesTable.roleId],
			references: [referencesRolesTable.id],
		}),
		user: one(usersTable, {
			fields: [usersRolesTable.userId],
			references: [usersTable.id],
		}),
	})
);
