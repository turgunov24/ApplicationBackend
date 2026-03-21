import { relations } from 'drizzle-orm';
import { integer, text } from 'drizzle-orm/pg-core';
import { pgTable, timestamp, serial } from 'drizzle-orm/pg-core';
import { usersTable } from '../users';
import { principalCustomersTable } from '../principalCustomers';
import { referencesTariffsTable } from './tariffs';

export const statuses = ['active', 'deleted', 'finished'] as const;

export const referencesAttachTariffToPrincipalCustomersTable = pgTable(
	'references_attach_tariff_to_principal_customers',
	{
		id: serial().primaryKey().notNull(),
		principalCustomerId: integer('principal_customer_id')
			.notNull()
			.references(() => principalCustomersTable.id),
		tariffId: integer('tariff_id')
			.notNull()
			.references(() => referencesTariffsTable.id),
		startDate: timestamp('start_date').notNull().defaultNow(),
		endDate: timestamp('end_date'),
		createdAt: timestamp().notNull().defaultNow(),
		updatedAt: timestamp().notNull().defaultNow(),
		status: text('status', { enum: statuses }).notNull().default('active'),
		createdBy: integer('created_by')
			.notNull()
			.references(() => usersTable.id),
	},
);

export const referencesAttachTariffToPrincipalCustomersRelations = relations(
	referencesAttachTariffToPrincipalCustomersTable,
	({ one }) => ({
		principalCustomer: one(principalCustomersTable, {
			fields: [referencesAttachTariffToPrincipalCustomersTable.principalCustomerId],
			references: [principalCustomersTable.id],
		}),
		tariff: one(referencesTariffsTable, {
			fields: [referencesAttachTariffToPrincipalCustomersTable.tariffId],
			references: [referencesTariffsTable.id],
		}),
		createdBy: one(usersTable, {
			fields: [referencesAttachTariffToPrincipalCustomersTable.createdBy],
			references: [usersTable.id],
		}),	
	}),
);
