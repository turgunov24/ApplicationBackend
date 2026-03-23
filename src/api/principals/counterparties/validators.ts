import { referencesCounterpartiesTable } from '../../../db/schemas/references/counterparties';
import { checkSchema, ParamSchema } from 'express-validator';
import { eq, InferInsertModel } from 'drizzle-orm';
import db from '../../../db';
import { Request } from 'express';

export type CreatePayload = Pick<
	InferInsertModel<typeof referencesCounterpartiesTable>,
	'name' | 'phone'
>;

type keys = keyof CreatePayload;

export type CreateValidationSchema = Record<keys, ParamSchema>;
export type UpdateValidationSchema = CreateValidationSchema &
	Record<'id', ParamSchema>;

const indexSchema: Record<'id', ParamSchema> = {
	id: {
		in: 'query',
		isInt: true,
		optional: true,
		custom: {
			options: async (value, { req }) => {
				if (value) {
					const counterparty = await db
						.select()
						.from(referencesCounterpartiesTable)
						.where(eq(referencesCounterpartiesTable.id, value));

					if (!counterparty.length)
						throw new Error('Counterparty not found');

					const principal = (req as Request).principal;

					if (counterparty[0].principalId !== principal.id)
						throw new Error(
							'You are not allowed to modify this counterparty',
						);
				}

				return true;
			},
		},
	},
};

const createSchema: CreateValidationSchema = {
	name: {
		in: 'body',
		isString: true,
		notEmpty: true,
		errorMessage: 'Counterparty name is required',
		trim: true,
	},
	phone: {
		in: 'body',
		isString: true,
		notEmpty: true,
		errorMessage: 'Counterparty phone is required',
		trim: true,
	},
};

const updateIdSchema: Record<'id', ParamSchema> = {
	id: {
		in: 'query',
		isInt: true,
		notEmpty: true,
		errorMessage: 'Counterparty id is required',
		custom: {
			options: async (value, { req }) => {
				const counterparty = await db
					.select()
					.from(referencesCounterpartiesTable)
					.where(eq(referencesCounterpartiesTable.id, value));

				if (!counterparty.length)
					throw new Error('Counterparty not found');

				const principal = (req as Request).principal;

				if (counterparty[0].principalId !== principal.id)
					throw new Error(
						'You are not allowed to modify this counterparty',
					);

				return true;
			},
		},
	},
};

const updateSchema: UpdateValidationSchema = {
	...createSchema,
	...updateIdSchema,
};

export const createValidator = checkSchema(createSchema);
export const updateValidator = checkSchema(updateSchema);
export const indexValidator = checkSchema(indexSchema);
