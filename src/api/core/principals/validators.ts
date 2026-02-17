import { principalsTable } from '../../../db/schemas/principals';
import { checkSchema, ParamSchema } from 'express-validator';
import { and, eq, InferInsertModel, ne } from 'drizzle-orm';
import db from '../../../db';
import { getAuthUserId } from '../../../utils/getAuthUserId';
import { Request } from 'express';
import { SUPER_ADMIN_ID } from '../../../helpers/config';

export type CreatePayload = Pick<
	InferInsertModel<typeof principalsTable>,
	| 'fullName'
	| 'username'
	| 'password'
	| 'email'
	| 'phone'
	| 'countryId'
	| 'regionId'
	| 'districtId'
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
					const principal = await db
						.select()
						.from(principalsTable)
						.where(eq(principalsTable.id, value));

					if (!principal.length) throw new Error('Principal not found');

					const userId = getAuthUserId(req as Request);

					if (userId === SUPER_ADMIN_ID) return true;

					if (principal[0].createdBy !== userId && principal[0].id !== userId) {
						throw new Error('You are not allowed to view this principal');
					}
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
		errorMessage: 'Principal id is required',
		custom: {
			options: async (value, { req }) => {
				const principal = await db
					.select()
					.from(principalsTable)
					.where(eq(principalsTable.id, value));

				if (!principal.length) throw new Error('Principal not found');

				const userId = getAuthUserId(req as Request);

				if (userId === SUPER_ADMIN_ID) return true;

				if (principal[0].createdBy !== userId)
					throw new Error(
						'You are not allowed to modify/delete this principal',
					);

				return true;
			},
		},
	},
};

const createSchema: CreateValidationSchema = {
	fullName: {
		in: 'body',
		isString: true,
		notEmpty: true,
		errorMessage: 'Full name is required',
		trim: true,
	},
	username: {
		in: 'body',
		isString: true,
		notEmpty: true,
		errorMessage: 'Principal username is required',
		trim: true,
		custom: {
			options: async (value) => {
				const principal = await db
					.select()
					.from(principalsTable)
					.where(eq(principalsTable.username, value));
				if (principal.length > 0) {
					throw new Error('Principal username already exists');
				}
				return true;
			},
		},
	},
	password: {
		in: 'body',
		isString: true,
		notEmpty: true,
		errorMessage: 'Principal password is required',
		trim: true,
		isLength: {
			options: {
				min: 8,
				max: 20,
			},
			errorMessage: 'Password must be between 8 and 20 characters',
		},
	},
	email: {
		in: 'body',
		isEmail: true,
		notEmpty: true,
		errorMessage: 'Principal email is required',
		trim: true,
		custom: {
			options: async (value) => {
				const principal = await db
					.select()
					.from(principalsTable)
					.where(eq(principalsTable.email, value));
				if (principal.length > 0) {
					throw new Error('Principal email already exists');
				}
				return true;
			},
		},
	},
	phone: {
		in: 'body',
		isString: true,
		notEmpty: true,
		errorMessage: 'Principal phone is required',
		trim: true,
	},
	countryId: {
		in: 'body',
		isInt: true,
		notEmpty: true,
		errorMessage: 'Principal country id is required',
	},
	regionId: {
		in: 'body',
		isInt: true,
		notEmpty: true,
		errorMessage: 'Principal region id is required',
	},
	districtId: {
		in: 'body',
		isInt: true,
		notEmpty: true,
		errorMessage: 'Principal district id is required',
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
	username: {
		in: 'body',
		isString: true,
		notEmpty: true,
		errorMessage: 'Principal username is required',
		trim: true,
		custom: {
			options: async (value, { req }) => {
				const { id } = req.query as { id: string };

				if (!id) {
					throw new Error('Principal id not provided');
				}
				const principals = await db
					.select()
					.from(principalsTable)
					.where(
						and(
							eq(principalsTable.username, value),
							ne(principalsTable.id, parseInt(id)),
						),
					);

				if (principals.length > 0)
					throw new Error('Principal username already exists');

				return true;
			},
		},
	},
	email: {
		in: 'body',
		isEmail: true,
		notEmpty: true,
		errorMessage: 'Principal email is required',
		trim: true,
		custom: {
			options: async (value, { req }) => {
				const { id } = req.query as { id: string };

				if (!id) {
					throw new Error('Principal id not provided');
				}
				const principals = await db
					.select()
					.from(principalsTable)
					.where(
						and(
							eq(principalsTable.email, value),
							ne(principalsTable.id, parseInt(id)),
						),
					);

				if (principals.length > 0)
					throw new Error('Principal email already exists');

				return true;
			},
		},
	},
};

export const createValidator = checkSchema(createSchema);
export const updateValidator = checkSchema(updateSchema);
export const deleteValidator = checkSchema(deleteSchema);
export const indexValidator = checkSchema(indexSchema);
export const uploadAvatarValidator = checkSchema(deleteSchema);
