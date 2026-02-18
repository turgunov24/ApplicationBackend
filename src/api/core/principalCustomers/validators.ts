import { principalCustomersTable } from '../../../db/schemas/principalCustomers';
import { checkSchema, ParamSchema } from 'express-validator';
import { eq, InferInsertModel } from 'drizzle-orm';
import db from '../../../db';
import { getAuthUserId } from '../../../utils/getAuthUserId';
import { Request } from 'express';
import { SUPER_ADMIN_ID } from '../../../helpers/config';

export type CreatePayload = Pick<
	InferInsertModel<typeof principalCustomersTable>,
	'name' | 'principalId' | 'clientTypeId'
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
					const principalCustomer = await db
						.select()
						.from(principalCustomersTable)
						.where(eq(principalCustomersTable.id, value));

					if (!principalCustomer.length)
						throw new Error('Principal customer not found');
					const userId = getAuthUserId(req as Request);

					if (userId === SUPER_ADMIN_ID) return true;

					if (principalCustomer[0].createdBy !== userId)
						throw new Error(
							'You are not allowed to view this principal customer',
						);
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
		errorMessage: 'Principal customer id is required',
		custom: {
			options: async (value, { req }) => {
				const principalCustomer = await db
					.select()
					.from(principalCustomersTable)
					.where(eq(principalCustomersTable.id, value));

				if (!principalCustomer.length)
					throw new Error('Principal customer not found');
				const userId = getAuthUserId(req as Request);

				if (userId === SUPER_ADMIN_ID) return true;

				if (principalCustomer[0].createdBy !== userId)
					throw new Error(
						'You are not allowed to modify this principal customer',
					);

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
		errorMessage: 'Principal customer name is required',
		trim: true,
	},
	principalId: {
		in: 'body',
		isInt: true,
		notEmpty: true,
		errorMessage: 'Principal id is required',
	},
	clientTypeId: {
		in: 'body',
		isInt: true,
		notEmpty: true,
		errorMessage: 'Client type id is required',
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
