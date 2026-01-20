import { text } from 'drizzle-orm/pg-core';
import { pgTable, varchar, timestamp, serial } from 'drizzle-orm/pg-core';

export const statuses = ['active', 'deleted'] as const;

export const referencesClientTypesTable = pgTable('references_client_types', {
	id: serial().primaryKey().notNull(),
	nameUz: varchar({ length: 255 }).notNull().default('client_type_name_uz'),
	nameRu: varchar({ length: 255 }).notNull().default('client_type_name_ru'),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp().notNull().defaultNow(),
	status: text('status', { enum: statuses }).notNull().default('active'),
});
