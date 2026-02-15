import { referencesTariffsTable } from '../../../db/schemas/references/tariffs';
import { checkSchema, ParamSchema } from 'express-validator';
import { eq, InferInsertModel } from 'drizzle-orm';
import db from '../../../db';
import { getAuthUserId } from '../../../utils/getAuthUserId';
import { Request } from 'express';
import { SUPER_ADMIN_ID } from '../../../helpers/config';
import { referencesCurrenciesTable } from '../../../db/schemas';

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
			options: async (value, { req }) => {
				if (value) {
					const tariff = await db
						.select()
						.from(referencesTariffsTable)
						.where(eq(referencesTariffsTable.id, value));

					if (!tariff.length) throw new Error('Tariff not found');
					const userId = getAuthUserId(req as Request);

					if (userId === SUPER_ADMIN_ID) return true;

					if (tariff[0].createdBy !== userId)
						throw new Error('You are not allowed to modify this tariff');
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
			options: async (value, { req }) => {
				const tariff = await db
					.select()
					.from(referencesTariffsTable)
					.where(eq(referencesTariffsTable.id, value));

				if (!tariff.length) throw new Error('Tariff not found');
				const userId = getAuthUserId(req as Request);

				if (userId === SUPER_ADMIN_ID) return true;

				if (tariff[0].createdBy !== userId)
					throw new Error('You are not allowed to modify this tariff');

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
		custom: {
			options: async (value, { req }) => {
				const currency = await db
					.select()
					.from(referencesCurrenciesTable)
					.where(eq(referencesCurrenciesTable.id, value));

				if (!currency.length) throw new Error('Currency not found');
				const userId = getAuthUserId(req as Request);

				if (userId === SUPER_ADMIN_ID) return true;

				if (currency[0].createdBy !== userId)
					throw new Error('You are not allowed to use this currency');

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
