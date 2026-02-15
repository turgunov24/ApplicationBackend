import { relations } from 'drizzle-orm';
import { text, integer } from 'drizzle-orm/pg-core';
import { pgTable, varchar, timestamp, serial } from 'drizzle-orm/pg-core';
import { referencesPermissionsTable } from './permissions';
import { usersTable } from '../users';

export const statuses = ['active', 'deleted'] as const;

export const referencesPermissionGroupsTable = pgTable(
	'references_permission_groups',
	{
		id: serial().primaryKey().notNull(),
		nameUz: varchar({ length: 255 })
			.notNull()
			.default('permission_group_name_uz'),
		nameRu: varchar({ length: 255 })
			.notNull()
			.default('permission_group_name_ru'),
		createdAt: timestamp().notNull().defaultNow(),
		updatedAt: timestamp().notNull().defaultNow(),
		status: text('status', { enum: statuses }).notNull().default('active'),
		createdBy: integer('created_by')
			.notNull()
			.references(() => usersTable.id),
	},
);

export const referencesPermissionGroupsRelations = relations(
	referencesPermissionGroupsTable,
	({ many }) => ({
		permissions: many(referencesPermissionsTable),
	}),
);
