import { relations } from 'drizzle-orm';
import { integer, text } from 'drizzle-orm/pg-core';
import { pgTable, varchar, timestamp, serial } from 'drizzle-orm/pg-core';
import { usersTable } from '../users';
import { principalCustomersTable } from '../principalCustomers';

export const statuses = ['pending', 'active', 'finished', 'send', 'cancelled', 'archived', 'deleted'] as const;

export const referencesTasksTable = pgTable('references_tasks', {
	id: serial().primaryKey().notNull(),
	taskId: serial('task_id').notNull().unique(),
	translationKey: varchar({ length: 255 }).notNull().default('client_type_name_uz'),
	description: varchar({ length: 500 }),
	deadline: timestamp('deadline'),
	principalCustomerId: integer('principal_customer_id')
		.notNull()
		.references(() => principalCustomersTable.id),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp().notNull().defaultNow(),
	status: text('status', { enum: statuses }).notNull().default('pending'),
	createdBy: integer('created_by')
		.notNull()
		.references(() => usersTable.id),
});

export const referencesTasksRelations = relations(
	referencesTasksTable,
	({ one }) => ({
		principalCustomer: one(principalCustomersTable, {
			fields: [referencesTasksTable.principalCustomerId],
			references: [principalCustomersTable.id],
		}),
		createdBy: one(usersTable, {
			fields: [referencesTasksTable.createdBy],
			references: [usersTable.id],
		}),
	}),
);
