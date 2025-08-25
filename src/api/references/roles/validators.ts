import { referencesRolesTable } from '../../../db/schemas/references/roles';
import { checkSchema, ParamSchema } from 'express-validator';
import { eq, InferInsertModel } from 'drizzle-orm';
import db from '../../../db';

export type CreatePayload = Pick<
	InferInsertModel<typeof referencesRolesTable>,
	'nameUz' | 'nameRu' | 'descriptionUz' | 'descriptionRu'
>;

type keys = keyof CreatePayload;

export type CreateValidationSchema = Record<keys, ParamSchema>;
export type DeleteValidationSchema = Record<'id', ParamSchema>;
export type ListValidationSchema = Record<'roleId', ParamSchema>;
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
					const role = await db
						.select()
						.from(referencesRolesTable)
						.where(eq(referencesRolesTable.id, value));

					if (!role.length) throw new Error('Role not found');
				}

				return true;
			},
		},
	},
};

const listSchema: ListValidationSchema = {
	roleId: {
		in: 'query',
		isInt: true,
		optional: true,
		custom: {
			options: async (value) => {
				if (value) {
					const role = await db
						.select()
						.from(referencesRolesTable)
						.where(eq(referencesRolesTable.id, value));

					if (!role.length) throw new Error('Role not found');
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
		errorMessage: 'Role id is required',
		custom: {
			options: async (value) => {
				const role = await db
					.select()
					.from(referencesRolesTable)
					.where(eq(referencesRolesTable.id, value));

				if (!role.length) throw new Error('Role not found');

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
		errorMessage: 'Role nameUz is required',
		trim: true,
	},
	nameRu: {
		in: 'body',
		isString: true,
		optional: true,
		errorMessage: 'Role nameRu is required',
		trim: true,
	},
	descriptionUz: {
		in: 'body',
		isString: true,
		optional: true,
		trim: true,
	},
	descriptionRu: {
		in: 'body',
		isString: true,
		optional: true,
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
export const listValidator = checkSchema(listSchema);