import { checkSchema, ParamSchema } from 'express-validator';
import { eq, InferInsertModel } from 'drizzle-orm';
import db from '../../../../db';
import { getAuthUserId } from '../../../../utils/getAuthUserId';
import { Request } from 'express';
import { SUPER_ADMIN_ID } from '../../../../helpers/config';
import { referencesPrincipalCustomerCredentialsTable } from '../../../../db/schemas/references/principalCustomerCredentials';

export type CreatePayload = Pick<
	InferInsertModel<typeof referencesPrincipalCustomerCredentialsTable>,
	| 'serviceId'
	| 'username'
	| 'password'
	| 'additionalInformationUz'
	| 'additionalInformationRu'
	| 'principalCustomerId'
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
					const credential = await db
						.select()
						.from(referencesPrincipalCustomerCredentialsTable)
						.where(eq(referencesPrincipalCustomerCredentialsTable.id, value));

					if (!credential.length) throw new Error('Credential not found');
					const userId = getAuthUserId(req as Request);

					if (userId === SUPER_ADMIN_ID) return true;

					if (credential[0].createdBy !== userId)
						throw new Error('You are not allowed to modify this credential');
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
		errorMessage: 'Credential id is required',
		custom: {
			options: async (value, { req }) => {
				const credential = await db
					.select()
					.from(referencesPrincipalCustomerCredentialsTable)
					.where(eq(referencesPrincipalCustomerCredentialsTable.id, value));

				if (!credential.length) throw new Error('Credential not found');
				const userId = getAuthUserId(req as Request);

				if (userId === SUPER_ADMIN_ID) return true;

				if (credential[0].createdBy !== userId)
					throw new Error('You are not allowed to modify this credential');

				return true;
			},
		},
	},
};

const createSchema: CreateValidationSchema = {
	serviceId: {
		in: 'body',
		isInt: true,
		notEmpty: true,
		errorMessage: 'Service id is required',
	},
	username: {
		in: 'body',
		isString: true,
		notEmpty: true,
		errorMessage: 'Username is required',
		trim: true,
	},
	password: {
		in: 'body',
		isString: true,
		notEmpty: true,
		errorMessage: 'Password is required',
		trim: true,
		isLength: {
			options: {
				min: 8,
				max: 20,
			},
			errorMessage: 'Password must be between 8 and 20 characters',
		},
	},
	additionalInformationUz: {
		in: 'body',
		isString: true,
		optional: true,
		trim: true,
	},
	additionalInformationRu: {
		in: 'body',
		isString: true,
		optional: true,
		trim: true,
	},
	principalCustomerId: {
		in: 'body',
		isInt: true,
		notEmpty: true,
		errorMessage: 'Principal customer id is required',
	},
};

const updateSchema: UpdateValidationSchema = {
	...createSchema,
	...deleteSchema,
	password: {
		in: 'body',
		isString: true,
		trim: true,
		optional: true,
		isLength: {
			options: {
				min: 8,
				max: 20,
			},
			errorMessage: 'Password must be between 8 and 20 characters',
		},
	},
};

export const createValidator = checkSchema(createSchema);
export const updateValidator = checkSchema(updateSchema);
export const deleteValidator = checkSchema(deleteSchema);
export const indexValidator = checkSchema(indexSchema);
