import {
	pgTable,
	timestamp,
	serial,
	integer,
	unique,
} from 'drizzle-orm/pg-core';
import { usersTable } from './users';
import { referencesPermissionsTable } from './references/permissions';

export const userRelPermissionsTable = pgTable(
	'users_rel_permissions',
	{
		id: serial().primaryKey().notNull(),
		userId: integer('user_id')
			.notNull()
			.references(() => usersTable.id, { onDelete: 'cascade' }),
		permissionId: integer('permission_id')
			.notNull()
			.references(() => referencesPermissionsTable.id, { onDelete: 'cascade' }),
		createdAt: timestamp().notNull().defaultNow(),
		updatedAt: timestamp().notNull().defaultNow(),
	},
	(table) => [unique().on(table.userId, table.permissionId)]
);
