import { relations } from 'drizzle-orm';
import { integer, text, uniqueIndex } from 'drizzle-orm/pg-core';
import { pgTable, varchar, timestamp, serial } from 'drizzle-orm/pg-core';
import { usersTable } from '../users';

export const statuses = ['active', 'deleted'] as const;

export const referencesTranslationsTable = pgTable(
	'references_translations',
	{
		id: serial().primaryKey().notNull(),
		lang: varchar({ length: 10 }).notNull(),
		namespace: varchar({ length: 100 }).notNull(),
		key: varchar({ length: 255 }).notNull(),
		value: text().notNull(),
		createdAt: timestamp().notNull().defaultNow(),
		updatedAt: timestamp().notNull().defaultNow(),
		status: text('status', { enum: statuses }).notNull().default('active'),
		createdBy: integer('created_by')
			.notNull()
			.references(() => usersTable.id),
	},
	(table) => [
		uniqueIndex('translations_lang_ns_key_idx').on(
			table.lang,
			table.namespace,
			table.key,
		),
	],
);

export const referencesTranslationsRelations = relations(
	referencesTranslationsTable,
	({ one }) => ({
		createdBy: one(usersTable, {
			fields: [referencesTranslationsTable.createdBy],
			references: [usersTable.id],
		}),
	}),
);
