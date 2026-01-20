import { text } from 'drizzle-orm/pg-core';
import { pgTable, varchar, timestamp, serial, } from 'drizzle-orm/pg-core';

export const statuses = ['active', 'deleted'] as const;

export const referencesCurrenciesTable = pgTable('references_currencies', {
	id: serial().primaryKey().notNull(),
	nameUz: varchar({ length: 255 }).notNull().default('currency_name_uz'),
	nameRu: varchar({ length: 255 }).notNull().default('currency_name_ru'),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp().notNull().defaultNow(),
	status: text('status', { enum: statuses }).notNull().default('active'),
});
