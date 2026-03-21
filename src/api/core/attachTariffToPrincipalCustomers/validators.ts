import { checkSchema, ParamSchema } from 'express-validator';
import { eq, InferInsertModel } from 'drizzle-orm';
import db from '../../../db';
import { getAuthUserId } from '../../../utils/getAuthUserId';
import { Request } from 'express';
import { SUPER_ADMIN_ID } from '../../../helpers/config';
import { referencesAttachTariffToPrincipalCustomersTable } from '../../../db/schemas/references/attachTariffToPrincipalCustomers';

export type CreatePayload = Pick<
	InferInsertModel<typeof referencesAttachTariffToPrincipalCustomersTable>,
	'principalCustomerId' | 'tariffId' | 'startDate' | 'endDate'
>;

type keys = keyof CreatePayload;

export type CreateValidationSchema = Record<keys, ParamSchema>;
export type DeleteValidationSchema = Record<'id', ParamSchema>;

const indexSchema: DeleteValidationSchema = {
	id: {
		in: 'query',
		isInt: true,
		optional: true,
		custom: {
			options: async (value, { req }) => {
				if (value) {
					const record = await db
						.select()
						.from(referencesAttachTariffToPrincipalCustomersTable)
						.where(
							eq(referencesAttachTariffToPrincipalCustomersTable.id, value),
						);

					if (!record.length)
						throw new Error('Attach tariff to principal customer not found');
					const userId = getAuthUserId(req as Request);

					if (userId === SUPER_ADMIN_ID) return true;

					if (record[0].createdBy !== userId)
						throw new Error('You are not allowed to modify this record');
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
		errorMessage: 'Attach tariff to principal customer id is required',
		custom: {
			options: async (value, { req }) => {
				const record = await db
					.select()
					.from(referencesAttachTariffToPrincipalCustomersTable)
					.where(eq(referencesAttachTariffToPrincipalCustomersTable.id, value));

				if (!record.length)
					throw new Error('Attach tariff to principal customer not found');
				const userId = getAuthUserId(req as Request);

				if (userId === SUPER_ADMIN_ID) return true;

				if (record[0].createdBy !== userId)
					throw new Error('You are not allowed to modify this record');

				return true;
			},
		},
	},
};

const createSchema: CreateValidationSchema = {
	principalCustomerId: {
		in: 'body',
		isInt: true,
		notEmpty: true,
		errorMessage: 'Principal customer id is required',
	},
	tariffId: {
		in: 'body',
		isInt: true,
		notEmpty: true,
		errorMessage: 'Tariff id is required',
	},
	startDate: {
		in: 'body',
		optional: true,
		isISO8601: true,
		errorMessage: 'Invalid start date format (must be ISO8601 date)',
	},
	endDate: {
		in: 'body',
		optional: { options: { values: 'falsy' } },
		isISO8601: true,
		errorMessage: 'Invalid end date format (must be ISO8601 date)',
	},
};

export const createValidator = checkSchema(createSchema);
export const deleteValidator = checkSchema(deleteSchema);
export const indexValidator = checkSchema(indexSchema);
