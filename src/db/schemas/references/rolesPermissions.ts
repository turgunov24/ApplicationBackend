import {
	pgTable,
	timestamp,
	serial,
	integer,
	unique,
} from 'drizzle-orm/pg-core';
import { referencesRolesTable } from './roles';
import { referencesPermissionsTable } from './permissions';

export const referencesRolesPermissionsTable = pgTable(
	'references_roles_permissions',
	{
		id: serial().primaryKey().notNull(),
		roleId: integer('role_id')
			.notNull()
			.references(() => referencesRolesTable.id, { onDelete: 'cascade' }),
		permissionId: integer('permission_id')
			.notNull()
			.references(() => referencesPermissionsTable.id, { onDelete: 'cascade' }),
		createdAt: timestamp().notNull().defaultNow(),
		updatedAt: timestamp().notNull().defaultNow(),
	},
	(table) => ({
		uniqueRolePermission: unique().on(table.roleId, table.permissionId),
	})
);
