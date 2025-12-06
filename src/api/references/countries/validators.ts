import { referencesCountriesTable } from '../../../db/schemas/references/countries'
import { checkSchema, ParamSchema } from 'express-validator'
import { eq, InferInsertModel } from 'drizzle-orm'
import db from '../../../db'

export type CreatePayload = Pick<
	InferInsertModel<typeof referencesCountriesTable>,
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
					const country = await db
						.select()
						.from(referencesCountriesTable)
						.where(eq(referencesCountriesTable.id, value));

					if (!country.length) throw new Error('Country not found');
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
		errorMessage: 'Country id is required',
		custom: {
			options: async (value) => {
				const country = await db
					.select()
					.from(referencesCountriesTable)
					.where(eq(referencesCountriesTable.id, value));

				if (!country.length) throw new Error('Country not found');

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
		errorMessage: 'Country nameUz is required',
		trim: true,
	},
	nameRu: {
		in: 'body',
		isString: true,
		optional: true,
		errorMessage: 'Country nameRu is required',
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
