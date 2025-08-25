import { text } from 'drizzle-orm/pg-core';
import {
	pgTable,
	varchar,
	timestamp,
	serial,
	integer,
} from 'drizzle-orm/pg-core';
import { referencesPermissionGroupsTable } from './permissionGroups';

export const statuses = ['active', 'deleted'] as const;

export const referencesPermissionsTable = pgTable('references_permissions', {
	id: serial().primaryKey().notNull(),
	nameUz: varchar({ length: 255 }).notNull().default('permission_name_uz'),
	nameRu: varchar({ length: 255 }).notNull().default('permission_name_ru'),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp().notNull().defaultNow(),
	status: text('status', { enum: statuses }).notNull().default('active'),
	permissionGroupId: integer('permission_group_id').references(
		() => referencesPermissionGroupsTable.id,
		{ onDelete: 'cascade' }
	),
});
