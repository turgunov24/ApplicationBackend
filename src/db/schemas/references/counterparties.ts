import { relations } from 'drizzle-orm';
import { integer, text } from 'drizzle-orm/pg-core';
import { pgTable, varchar, timestamp, serial } from 'drizzle-orm/pg-core';
import { usersTable } from '../users';

export const statuses = ['active', 'deleted'] as const;

export const referencesCounterpartiesTable = pgTable(
	'references_counterparties',
	{
		id: serial().primaryKey().notNull(),
		name: varchar({ length: 255 }).notNull().default('counterparty_name'),
		createdAt: timestamp().notNull().defaultNow(),
		updatedAt: timestamp().notNull().defaultNow(),
		status: text('status', { enum: statuses }).notNull().default('active'),
		createdBy: integer('created_by')
			.notNull()
			.references(() => usersTable.id),
	},
);

export const referencesCounterpartiesRelations = relations(
	referencesCounterpartiesTable,
	({ one }) => ({
		createdBy: one(usersTable, {
			fields: [referencesCounterpartiesTable.createdBy],
			references: [usersTable.id],
		}),
	}),
);
