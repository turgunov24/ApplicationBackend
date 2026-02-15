import { integer } from 'drizzle-orm/pg-core';
import { pgTable, varchar, timestamp, serial } from 'drizzle-orm/pg-core';
import { referencesCountriesTable } from './countries';
import { text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { referencesDistrictsTable } from './districts';
import { usersTable } from '../users';

export const statuses = ['active', 'deleted'] as const;

export const referencesRegionsTable = pgTable('references_regions', {
	id: serial().primaryKey().notNull(),
	nameUz: varchar({ length: 255 }).notNull().default('region_name_uz'),
	nameRu: varchar({ length: 255 }).notNull().default('region_name_ru'),
	countryId: integer('country_id')
		.notNull()
		.references(() => referencesCountriesTable.id),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp().notNull().defaultNow(),
	status: text('status', { enum: statuses }).notNull().default('active'),
	createdBy: integer('created_by')
		.notNull()
		.references(() => usersTable.id),
});

export const referencesRegionsRelations = relations(
	referencesRegionsTable,
	({ one, many }) => ({
		country: one(referencesCountriesTable, {
			fields: [referencesRegionsTable.countryId],
			references: [referencesCountriesTable.id],
		}),
		districts: many(referencesDistrictsTable),
	}),
);
