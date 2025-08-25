import {
	pgTable,
	timestamp,
	serial,
	integer,
	unique,
} from 'drizzle-orm/pg-core';
import { usersTable } from './users';
import { referencesRolesTable } from './references/roles';

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
	(table) => ({
		uniqueUserRole: unique().on(table.userId, table.roleId),
	})
);
