import { relations } from 'drizzle-orm';
import { integer, text } from 'drizzle-orm/pg-core';
import { pgTable, varchar, timestamp, serial } from 'drizzle-orm/pg-core';
import { usersTable } from './users';
import { principalsTable } from './principals';
import { referencesClientTypesTable } from './references/clientTypes';
import { referencesCounterpartiesTable } from './references/counterparties';
import { referencesLegalFormsTable } from './references/legalForms';
import { referencesPrincipalCustomerCredentialsTable } from './references/principalCustomerCredentials';
import { referencesAttachTariffToPrincipalCustomersTable } from './references/attachTariffToPrincipalCustomers';

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
	counterpartyId: integer('counterparty_id')
		.notNull()
		.references(() => referencesCounterpartiesTable.id),
	legalFormId: integer('legal_form_id')
		.notNull()
		.references(() => referencesLegalFormsTable.id),
	espPath: text('esp_path'),
	espExpireDate: timestamp('esp_expire_date'),
	createdBy: integer('created_by')
		.notNull()
		.references(() => usersTable.id),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp().notNull().defaultNow(),
});

export const principalCustomersRelations = relations(
	principalCustomersTable,
	({ one, many }) => ({
		principal: one(principalsTable, {
			fields: [principalCustomersTable.principalId],
			references: [principalsTable.id],
		}),
		clientType: one(referencesClientTypesTable, {
			fields: [principalCustomersTable.clientTypeId],
			references: [referencesClientTypesTable.id],
		}),
		counterparty: one(referencesCounterpartiesTable, {
			fields: [principalCustomersTable.counterpartyId],
			references: [referencesCounterpartiesTable.id],
		}),
		legalForm: one(referencesLegalFormsTable, {
			fields: [principalCustomersTable.legalFormId],
			references: [referencesLegalFormsTable.id],
		}),
		createdBy: one(usersTable, {
			fields: [principalCustomersTable.createdBy],
			references: [usersTable.id],
		}),
		credentials: many(referencesPrincipalCustomerCredentialsTable),
		attachTariffToPrincipalCustomers: many(referencesAttachTariffToPrincipalCustomersTable),
	}),
);
