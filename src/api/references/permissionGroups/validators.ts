import { referencesPermissionGroupsTable } from '../../../db/schemas/references/permissionGroups';
import { checkSchema, ParamSchema } from 'express-validator';
import { and, eq, InferInsertModel, ne } from 'drizzle-orm';
import db from '../../../db';

export type CreatePayload = Pick<
	InferInsertModel<typeof referencesPermissionGroupsTable>,
	'nameUz' | 'nameRu'
>;

type keys = keyof CreatePayload;

export type CreateValidationSchema = Record<keys, ParamSchema>;
export type DeleteValidationSchema = Record<'id', ParamSchema>;
export type UpdateValidationSchema = CreateValidationSchema &
	DeleteValidationSchema;

const indexSchema: DeleteValidationSchema = {
	id: {
		in: 'query',
		isInt: true,
		optional: true,
		custom: {
			options: async (value) => {
				if (value) {
					const permissionGroup = await db
						.select()
						.from(referencesPermissionGroupsTable)
						.where(eq(referencesPermissionGroupsTable.id, value));

					if (!permissionGroup.length)
						throw new Error('Permission group not found');
				}

				return true;
			},
		},
	},
};

const deleteSchema: DeleteValidationSchema = {
	id: {
		in: 'query',
		isInt: true,
		notEmpty: true,
		errorMessage: 'Permission group id is required',
		custom: {
			options: async (value) => {
				const permissionGroup = await db
					.select()
					.from(referencesPermissionGroupsTable)
					.where(eq(referencesPermissionGroupsTable.id, value));

				if (!permissionGroup.length)
					throw new Error('Permission group not found');

				return true;
			},
		},
	},
};

const createSchema: CreateValidationSchema = {
	nameUz: {
		in: 'body',
		isString: true,
		notEmpty: true,
		errorMessage: 'Permission group nameUz is required',
		trim: true,
	},
	nameRu: {
		in: 'body',
		isString: true,
		optional: true,
		errorMessage: 'Permission group nameRu is required',
		trim: true,
	},
};

const updateSchema: UpdateValidationSchema = {
	...createSchema,
	...deleteSchema,
};

export const createValidator = checkSchema(createSchema);
export const updateValidator = checkSchema(updateSchema);
export const deleteValidator = checkSchema(deleteSchema);
export const indexValidator = checkSchema(indexSchema);
