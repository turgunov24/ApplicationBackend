import { relations } from 'drizzle-orm';
import { integer, text } from 'drizzle-orm/pg-core';
import { pgTable, varchar, timestamp, serial } from 'drizzle-orm/pg-core';
import { usersTable } from '../users';

export const statuses = ['active', 'deleted'] as const;

export const referencesTaskRecurrenceTable = pgTable('references_task_recurrence', {
	id: serial().primaryKey().notNull(),
	translationKey: varchar({ length: 255 }).notNull().default('translation_key'),
	token: varchar({ length: 255 }).notNull(),
	description: varchar({ length: 500 }),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp().notNull().defaultNow(),
	status: text('status', { enum: statuses }).notNull().default('active'),
	createdBy: integer('created_by')
		.notNull()
		.references(() => usersTable.id),
});

export const referencesTaskRecurrenceRelations = relations(
	referencesTaskRecurrenceTable,
	({ one }) => ({
		createdBy: one(usersTable, {
			fields: [referencesTaskRecurrenceTable.createdBy],
			references: [usersTable.id],
		}),
	}),
);
