import { checkSchema, ParamSchema } from 'express-validator';
import { eq, InferInsertModel } from 'drizzle-orm';
import db from '../../../db';
import { referencesPermissionsTable } from '../../../db/schemas/references/permissions';
import { referencesPermissionGroupsTable } from '../../../db/schemas/references/permissionGroups';

export type CreatePayload = Pick<
	InferInsertModel<typeof referencesPermissionsTable>,
	'nameUz' | 'nameRu' | 'permissionGroupId'
>;

type keys = keyof CreatePayload;

export type CreateValidationSchema = Record<keys, ParamSchema>;
export type DeleteValidationSchema = Record<'id', ParamSchema>;
export type ListValidationSchema = Record<'permissionGroupId', ParamSchema>;
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
					const permission = await db
						.select()
						.from(referencesPermissionsTable)
						.where(eq(referencesPermissionsTable.id, value));

					if (!permission.length) throw new Error('Permission not found');
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
		errorMessage: 'Permission id is required',
		custom: {
			options: async (value) => {
				const permission = await db
					.select()
					.from(referencesPermissionsTable)
					.where(eq(referencesPermissionsTable.id, value));

				if (!permission.length) throw new Error('Permission not found');

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
		errorMessage: 'Permission nameUz is required',
		trim: true,
	},
	nameRu: {
		in: 'body',
		isString: true,
		optional: true,
		errorMessage: 'Permission nameRu is required',
		trim: true,
	},
	permissionGroupId: {
		in: 'body',
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

const listSchema: ListValidationSchema = {
	permissionGroupId: {
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

const updateSchema: UpdateValidationSchema = {
	...createSchema,
	...deleteSchema,
};

export const createValidator = checkSchema(createSchema);
export const updateValidator = checkSchema(updateSchema);
export const deleteValidator = checkSchema(deleteSchema);
export const indexValidator = checkSchema(indexSchema);
export const listValidator = checkSchema(listSchema);
