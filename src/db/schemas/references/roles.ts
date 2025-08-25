import { text } from 'drizzle-orm/pg-core';
import { pgTable, varchar, timestamp, serial } from 'drizzle-orm/pg-core';

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
});
