import { InferInsertModel } from 'drizzle-orm';
import { pgTable, varchar, timestamp, serial } from 'drizzle-orm/pg-core';
import { ParamSchema } from 'express-validator';

export const organizationsTable = pgTable('organizations', {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp().notNull().defaultNow(),
	token: varchar({ length: 500 }).notNull().unique(),
});

export type OrganizationInsert = InferInsertModel<typeof organizationsTable>;
type keys = keyof OrganizationInsert;

export type OrganizationCreateValidationSchema = Record<
	Exclude<keys, 'createdAt' | 'updatedAt' | 'id' | 'token'>,
	ParamSchema
>;
