import { integer, text } from 'drizzle-orm/pg-core';
import { pgTable, varchar, timestamp, serial } from 'drizzle-orm/pg-core';
import { usersTable } from './users';
import { principalsTable } from './principals';
import { referencesClientTypesTable } from './references/clientTypes';

export const statuses = [
	'active',
	'pending',
	'banned',
	'rejected',
	'deleted',
] as const;

export const principalCustomersTable = pgTable('principal_customers', {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	status: text('status', { enum: statuses }).notNull().default('pending'),
	principalId: integer('principal_id')
		.notNull()
		.references(() => principalsTable.id),
	clientTypeId: integer('client_type_id')
		.notNull()
		.references(() => referencesClientTypesTable.id),
	createdBy: integer('created_by')
		.notNull()
		.references(() => usersTable.id),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp().notNull().defaultNow(),
});
