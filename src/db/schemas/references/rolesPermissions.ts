import { pgTable, timestamp, serial, integer } from 'drizzle-orm/pg-core';
import { referencesRolesTable } from './roles';
import { referencesPermissionsTable } from './permissions';
import { primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import db from '../..'

export const referencesRolesPermissionsTable = pgTable(
	'references_roles_permissions',
	{
		roleId: integer('role_id')
			.notNull()
			.references(() => referencesRolesTable.id, { onDelete: 'cascade' }),
		permissionId: integer('permission_id')
			.notNull()
			.references(() => referencesPermissionsTable.id, { onDelete: 'cascade' }),
		createdAt: timestamp().notNull().defaultNow(),
		updatedAt: timestamp().notNull().defaultNow(),
	},
	(t) => [primaryKey({ columns: [t.roleId, t.permissionId] })]
);

export const referenceRolesPermissionsRelations = relations(
	referencesRolesPermissionsTable,
	({ one }) => ({
		role: one(referencesRolesTable, {
			fields: [referencesRolesPermissionsTable.roleId],
			references: [referencesRolesTable.id],
		}),
		permission: one(referencesPermissionsTable, {
			fields: [referencesRolesPermissionsTable.permissionId],
			references: [referencesPermissionsTable.id],
		}),
	})
);
