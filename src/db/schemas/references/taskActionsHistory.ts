import { relations } from 'drizzle-orm';
import { integer, text } from 'drizzle-orm/pg-core';
import { pgTable, timestamp, serial } from 'drizzle-orm/pg-core';
import { usersTable } from '../users';
import { referencesTasksTable } from './tasks';

export const statuses = ['pending', 'active', 'finished', 'send', 'cancelled', 'archived', 'deleted'] as const;
export const types = ['changeStatus'] as const;

export const referencesTaskActionsHistoryTable = pgTable('references_task_actions_history', {
	id: serial().primaryKey().notNull(),
	taskId: integer('task_id')
		.notNull()
		.references(() => referencesTasksTable.id),
	type: text('type', { enum: types }).notNull().default('changeStatus'),
	status: text('status', { enum: statuses }).notNull().default('pending'),
	createdAt: timestamp().notNull().defaultNow(),
	createdBy: integer('created_by')
		.notNull()
		.references(() => usersTable.id),
});

export const referencesTaskActionsHistoryRelations = relations(
	referencesTaskActionsHistoryTable,
	({ one }) => ({
		task: one(referencesTasksTable, {
			fields: [referencesTaskActionsHistoryTable.taskId],
			references: [referencesTasksTable.id],
		}),
		createdBy: one(usersTable, {
			fields: [referencesTaskActionsHistoryTable.createdBy],
			references: [usersTable.id],
		}),
	}),
);
