import { relations } from 'drizzle-orm';
import { integer, text, uniqueIndex } from 'drizzle-orm/pg-core';
import { pgTable, varchar, timestamp, serial } from 'drizzle-orm/pg-core';
import { usersTable } from '../users';

export const statuses = ['active', 'deleted'] as const;

export const referencesUserTranslationsTable = pgTable(
	'references_user_translations',
	{
		id: serial().primaryKey().notNull(),
		userId: integer('user_id')
			.notNull()
			.references(() => usersTable.id),
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
		uniqueIndex('user_translations_user_lang_ns_key_idx').on(
			table.userId,
			table.lang,
			table.namespace,
			table.key,
		),
	],
);

export const referencesUserTranslationsRelations = relations(
	referencesUserTranslationsTable,
	({ one }) => ({
		user: one(usersTable, {
			fields: [referencesUserTranslationsTable.userId],
			references: [usersTable.id],
		}),
		createdBy: one(usersTable, {
			fields: [referencesUserTranslationsTable.createdBy],
			references: [usersTable.id],
		}),
	}),
);
