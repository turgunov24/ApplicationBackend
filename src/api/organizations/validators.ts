import {
	OrganizationCreateValidationSchema,
	organizationsTable,
} from '../../db/schemas/organizations';
import { checkSchema, Schema } from 'express-validator';
import { eq } from 'drizzle-orm';
import db from '../../db';

const deleteSchema: Schema = {
	id: {
		in: 'query',
		isInt: true,
		notEmpty: true,
		errorMessage: 'Organization id is required',
		custom: {
			options: async (value) => {
				const place = await db
					.select()
					.from(organizationsTable)
					.where(eq(organizationsTable.id, value));

				if (!place.length) throw new Error('Direction not found');

				return true;
			},
		},
	},
};

const createSchema: OrganizationCreateValidationSchema = {
	name: {
		in: 'body',
		isString: true,
		notEmpty: true,
		errorMessage: 'Organization name is required',
		trim: true,
		custom: {
			options: async (value) => {
				const direction = await db
					.select()
					.from(organizationsTable)
					.where(eq(organizationsTable.name, value));
				if (direction.length > 0) {
					throw new Error('Organization name already exists');
				}
				return true;
			},
		},
	},
};

const updateSchema: Schema = {
	...createSchema,
	...deleteSchema,
};

export const createValidator = checkSchema(createSchema);
export const updateValidator = checkSchema(updateSchema);
export const deleteValidator = checkSchema(deleteSchema);
