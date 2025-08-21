import { integer } from 'drizzle-orm/pg-core';
import { pgTable, varchar, timestamp, serial } from 'drizzle-orm/pg-core';
import { referencesRegionsTable } from './regions';
import { text } from 'drizzle-orm/pg-core'

export const statuses = ['active', 'deleted'] as const;

export const referencesDistrictsTable = pgTable('references_districts', {
	id: serial().primaryKey().notNull(),
	nameUz: varchar({ length: 255 }).notNull().default('district_name_uz'),
	nameRu: varchar({ length: 255 }).notNull().default('district_name_ru'),
	regionId: integer('region_id')
		.notNull()
		.references(() => referencesRegionsTable.id),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp().notNull().defaultNow(),
	status: text('status', { enum: statuses }).notNull().default('active'),
});
