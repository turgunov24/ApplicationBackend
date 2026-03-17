import { relations } from 'drizzle-orm';
import { integer, text } from 'drizzle-orm/pg-core';
import { pgTable, varchar, timestamp, serial } from 'drizzle-orm/pg-core';
import { usersTable } from '../users';
import { referencesServicesTable } from './services';
import { principalCustomersTable } from '../principalCustomers';

export const statuses = ['active', 'deleted'] as const;

export const referencesPrincipalCustomerCredentialsTable = pgTable(
	'references_principal_customer_credentials',
	{
		id: serial().primaryKey().notNull(),
		serviceId: integer('service_id')
			.notNull()
			.references(() => referencesServicesTable.id),
		username: varchar({ length: 50 }).notNull(),
		password: varchar({ length: 100 }).notNull(),
		additionalInformationUz: varchar({ length: 500 }),
		additionalInformationRu: varchar({ length: 500 }),
		principalCustomerId: integer('principal_customer_id')
			.notNull()
			.references(() => principalCustomersTable.id),
		createdAt: timestamp().notNull().defaultNow(),
		updatedAt: timestamp().notNull().defaultNow(),
		status: text('status', { enum: statuses }).notNull().default('active'),
		createdBy: integer('created_by')
			.notNull()
			.references(() => usersTable.id),
	},
);

export const referencesPrincipalCustomerCredentialsRelations = relations(
	referencesPrincipalCustomerCredentialsTable,
	({ one }) => ({
		service: one(referencesServicesTable, {
			fields: [referencesPrincipalCustomerCredentialsTable.serviceId],
			references: [referencesServicesTable.id],
		}),
		principalCustomer: one(principalCustomersTable, {
			fields: [referencesPrincipalCustomerCredentialsTable.principalCustomerId],
			references: [principalCustomersTable.id],
		}),
		createdBy: one(usersTable, {
			fields: [referencesPrincipalCustomerCredentialsTable.createdBy],
			references: [usersTable.id],
		}),
	}),
);
