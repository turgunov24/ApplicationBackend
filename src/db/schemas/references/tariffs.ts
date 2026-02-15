import { integer, text } from 'drizzle-orm/pg-core';
import { pgTable, varchar, timestamp, serial } from 'drizzle-orm/pg-core';
import { referencesCurrenciesTable } from './currencies';
import { relations } from 'drizzle-orm';
import { usersTable } from '../users';

export const statuses = ['active', 'deleted'] as const;

export const referencesTariffsTable = pgTable('references_tariffs', {
	id: serial().primaryKey().notNull(),
	nameUz: varchar({ length: 255 }).notNull().default('tariff_name_uz'),
	nameRu: varchar({ length: 255 }).notNull().default('tariff_name_ru'),
	monthlyPrice: integer('monthly_price').notNull().default(0),
	currencyId: integer('currency_id')
		.notNull()
		.references(() => referencesCurrenciesTable.id),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp().notNull().defaultNow(),
	status: text('status', { enum: statuses }).notNull().default('active'),
	createdBy: integer('created_by')
		.notNull()
		.references(() => usersTable.id),
});

export const referencesTariffsRelations = relations(
	referencesTariffsTable,
	({ one }) => ({
		currency: one(referencesCurrenciesTable, {
			fields: [referencesTariffsTable.currencyId],
			references: [referencesCurrenciesTable.id],
		}),
	}),
);
