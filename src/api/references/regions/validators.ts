import { referencesRegionsTable } from '../../../db/schemas/references/regions';
import { checkSchema, ParamSchema } from 'express-validator';
import { eq, InferInsertModel } from 'drizzle-orm';
import db from '../../../db';
import { referencesCountriesTable } from '../../../db/schemas/references/countries';

export type CreatePayload = Pick<
	InferInsertModel<typeof referencesRegionsTable>,
	'nameUz' | 'nameRu' | 'countryId'
>;

type keys = keyof CreatePayload;

export type CreateValidationSchema = Record<keys, ParamSchema>;
export type DeleteValidationSchema = Record<'id', ParamSchema>;
export type ListValidationSchema = Record<'countryId', ParamSchema>;
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
				

					const region = await db
						.select()
						.from(referencesRegionsTable)
						.where(eq(referencesRegionsTable.id, value));

					if (!region.length) throw new Error('Region not found');
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
		errorMessage: 'Region id is required',
		custom: {
			options: async (value) => {
				

				const region = await db
					.select()
					.from(referencesRegionsTable)
					.where(eq(referencesRegionsTable.id, value));

				if (!region.length) throw new Error('Region not found');

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
		errorMessage: 'Region nameUz is required',
		trim: true,
	},
	nameRu: {
		in: 'body',
		isString: true,
		optional: true,
		errorMessage: 'Region nameRu is required',
		trim: true,
	},
	countryId: {
		in: 'body',
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

const listSchema: ListValidationSchema = {
	countryId: {
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

const updateSchema: UpdateValidationSchema = {
	...createSchema,
	...deleteSchema,
};

export const createValidator = checkSchema(createSchema);
export const updateValidator = checkSchema(updateSchema);
export const deleteValidator = checkSchema(deleteSchema);
export const indexValidator = checkSchema(indexSchema);
export const listValidator = checkSchema(listSchema);
