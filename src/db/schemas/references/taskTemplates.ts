import { relations } from 'drizzle-orm';
import { integer, text } from 'drizzle-orm/pg-core';
import { pgTable, varchar, timestamp, serial } from 'drizzle-orm/pg-core';
import { usersTable } from '../users';
import { referencesTaskRecurrenceTable } from './taskRecurrence';
import { referencesTaskTemplateCategoriesTable } from './taskTemplateCategories';

export const statuses = ['active', 'inactive', 'deleted'] as const;

export const referencesTaskTemplatesTable = pgTable('references_task_templates', {
	id: serial().primaryKey().notNull(),
	translationKey: varchar({ length: 255 }).notNull().default('translation_key'),
	description: varchar({ length: 500 }),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp().notNull().defaultNow(),
	status: text('status', { enum: statuses }).notNull().default('active'),
	recurrenceId: integer('recurrence_id')
		.notNull()
		.references(() => referencesTaskRecurrenceTable.id),
	taskTemplateCategoryId: integer('task_template_category_id')
		.notNull()
		.references(() => referencesTaskTemplateCategoriesTable.id),
	date: timestamp('date'),
	dayOfMonth: integer('day_of_month'),
	monthOfQuarter: integer('month_of_quarter'),
	monthOfYear: integer('month_of_year'),
	createdBy: integer('created_by')
		.notNull()
		.references(() => usersTable.id),
});

export const referencesTaskTemplatesRelations = relations(
	referencesTaskTemplatesTable,
	({ one }) => ({
		createdBy: one(usersTable, {
			fields: [referencesTaskTemplatesTable.createdBy],
			references: [usersTable.id],
		}),
		recurrence: one(referencesTaskRecurrenceTable, {
			fields: [referencesTaskTemplatesTable.recurrenceId],
			references: [referencesTaskRecurrenceTable.id],
		}),
		taskTemplateCategory: one(referencesTaskTemplateCategoriesTable, {
			fields: [referencesTaskTemplatesTable.taskTemplateCategoryId],
			references: [referencesTaskTemplateCategoriesTable.id],
		}),
	}),
);
