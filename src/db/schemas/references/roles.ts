import { relations } from 'drizzle-orm';
import {
	pgTable,
	varchar,
	timestamp,
	serial,
	text,
	integer,
} from 'drizzle-orm/pg-core';
import { referencesRolesPermissionsTable } from './rolesPermissions';
import { usersRolesTable } from '../usersRoles';
import { usersTable } from '../users';

export const statuses = ['active', 'deleted'] as const;

export const referencesRolesTable = pgTable('references_roles', {
	id: serial().primaryKey().notNull(),
	nameUz: varchar({ length: 255 }).notNull().default('role_name_uz'),
	nameRu: varchar({ length: 255 }).notNull().default('role_name_ru'),
	descriptionUz: varchar({ length: 500 }),
	descriptionRu: varchar({ length: 500 }),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp().notNull().defaultNow(),
	status: text('status', { enum: statuses }).notNull().default('active'),
	createdBy: integer('created_by')
		.notNull()
		.references(() => usersTable.id),
});

export const referenceRolesRelations = relations(
	referencesRolesTable,
	({ many }) => ({
		rolesPermissions: many(referencesRolesPermissionsTable),
		roleUsers: many(usersRolesTable),
	}),
);
