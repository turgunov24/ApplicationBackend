import { text } from 'drizzle-orm/pg-core';
import {
	pgTable,
	varchar,
	timestamp,
	serial,
	integer,
} from 'drizzle-orm/pg-core';

export const statuses = [
	'active',
	'pending',
	'banned',
	'rejected',
	'deleted',
] as const;

export const usersTable = pgTable('users', {
	id: serial().primaryKey().notNull(),
	fullName: varchar({ length: 255 }).notNull(),
	username: varchar({ length: 50 }).notNull().unique(),
	email: varchar({ length: 255 }).notNull().unique(),
	phone: varchar({ length: 255 }).notNull().unique(),
	countryId: integer('country_id').notNull(),
	regionId: integer('region_id').notNull(),
	cityId: integer('city_id').notNull(),
	token: varchar({ length: 500 }),
	password: varchar({ length: 100 }).notNull(),
	status: text('status', { enum: statuses }).notNull().default('pending'),
	avatarPath: text('avatar_path')
		.notNull()
		.default('uploads/avatars/default-avatar.jpg'),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp().notNull().defaultNow(),
});
