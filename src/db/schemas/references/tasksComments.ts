import { relations } from 'drizzle-orm';
import { integer, text } from 'drizzle-orm/pg-core';
import { pgTable, varchar, timestamp, serial } from 'drizzle-orm/pg-core';
import { usersTable } from '../users';
import { referencesTasksTable } from './tasks';

export const statuses = ['active', 'deleted'] as const;

export const referencesTasksCommentsTable = pgTable('references_tasks_comments', {
	id: serial().primaryKey().notNull(),
	taskId: integer('task_id')
		.notNull()
		.references(() => referencesTasksTable.id),
	text: varchar({ length: 500 }).notNull(),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp().notNull().defaultNow(),
	status: text('status', { enum: statuses }).notNull().default('active'),
	createdBy: integer('created_by')
		.notNull()
		.references(() => usersTable.id),
});

export const referencesTasksCommentsRelations = relations(
	referencesTasksCommentsTable,
	({ one }) => ({
		task: one(referencesTasksTable, {
			fields: [referencesTasksCommentsTable.taskId],
			references: [referencesTasksTable.id],
		}),
		createdBy: one(usersTable, {
			fields: [referencesTasksCommentsTable.createdBy],
			references: [usersTable.id],
		}),
	}),
);
