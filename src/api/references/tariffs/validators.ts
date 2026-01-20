import { referencesTariffsTable } from '../../../db/schemas/references/tariffs';
import { checkSchema, ParamSchema } from 'express-validator';
import { eq, InferInsertModel } from 'drizzle-orm';
import db from '../../../db';

export type CreatePayload = Pick<
	InferInsertModel<typeof referencesTariffsTable>,
	'nameUz' | 'nameRu' | 'monthlyPrice' | 'currencyId'
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
					const tariff = await db
						.select()
						.from(referencesTariffsTable)
						.where(eq(referencesTariffsTable.id, value));

					if (!tariff.length) throw new Error('Tariff not found');
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
		errorMessage: 'Tariff id is required',
		custom: {
			options: async (value) => {
				const tariff = await db
					.select()
					.from(referencesTariffsTable)
					.where(eq(referencesTariffsTable.id, value));

				if (!tariff.length) throw new Error('Tariff not found');

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
		errorMessage: 'Tariff nameUz is required',
		trim: true,
	},
	nameRu: {
		in: 'body',
		isString: true,
		optional: true,
		errorMessage: 'Tariff nameRu is required',
		trim: true,
	},
	monthlyPrice: {
		in: 'body',
		isInt: true,
		notEmpty: true,
		errorMessage: 'Monthly price is required',
		toInt: true,
	},
	currencyId: {
		in: 'body',
		isInt: true,
		notEmpty: true,
		errorMessage: 'Currency is required',
		toInt: true,
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
