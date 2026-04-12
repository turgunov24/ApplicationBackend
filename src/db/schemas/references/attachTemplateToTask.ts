import { relations } from 'drizzle-orm';
import { integer, text } from 'drizzle-orm/pg-core';
import { pgTable, timestamp, serial } from 'drizzle-orm/pg-core';
import { usersTable } from '../users';
import { principalCustomersTable } from '../principalCustomers';
import { referencesTaskTemplatesTable } from './taskTemplates';

export const statuses = ['active', 'deleted', 'finished'] as const;

export const referencesAttachTemplateToTaskTable = pgTable(
	'references_attach_template_to_task',
	{
		id: serial().primaryKey().notNull(),
		principalCustomerId: integer('principal_customer_id')
			.notNull()
			.references(() => principalCustomersTable.id),
		taskTemplateId: integer('task_template_id')
			.notNull()
			.references(() => referencesTaskTemplatesTable.id),
		startDate: timestamp('start_date').notNull().defaultNow(),
		endDate: timestamp('end_date').notNull().defaultNow(),
		createdAt: timestamp().notNull().defaultNow(),
		updatedAt: timestamp().notNull().defaultNow(),
		status: text('status', { enum: statuses }).notNull().default('active'),
		createdBy: integer('created_by')
			.notNull()
			.references(() => usersTable.id),
	},
);

export const referencesAttachTemplateToTaskRelations = relations(
	referencesAttachTemplateToTaskTable,
	({ one }) => ({
		principalCustomer: one(principalCustomersTable, {
			fields: [referencesAttachTemplateToTaskTable.principalCustomerId],
			references: [principalCustomersTable.id],
		}),
		taskTemplate: one(referencesTaskTemplatesTable, {
			fields: [referencesAttachTemplateToTaskTable.taskTemplateId],
			references: [referencesTaskTemplatesTable.id],
		}),
		createdBy: one(usersTable, {
			fields: [referencesAttachTemplateToTaskTable.createdBy],
			references: [usersTable.id],
		}),
	}),
);
