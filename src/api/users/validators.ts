import { usersTable } from '../../db/schemas/users';
import { checkSchema, ParamSchema, Schema } from 'express-validator';
import { eq, InferInsertModel } from 'drizzle-orm';
import db from '../../db';

export type CreatePayload = Pick<
	InferInsertModel<typeof usersTable>,
	| 'fullName'
	| 'username'
	| 'password'
	| 'email'
	| 'phone'
	| 'countryId'
	| 'regionId'
	| 'cityId'
	| 'roleId'
>;

type keys = keyof CreatePayload;

export type CreateValidationSchema = Record<keys, ParamSchema>;
export type DeleteValidationSchema = Record<'id', ParamSchema>;

const deleteSchema: DeleteValidationSchema = {
	id: {
		in: 'query',
		isInt: true,
		notEmpty: true,
		errorMessage: 'User id is required',
		custom: {
			options: async (value) => {
				const place = await db
					.select()
					.from(usersTable)
					.where(eq(usersTable.id, value));

				if (!place.length) throw new Error('User not found');

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
		errorMessage: 'User name is required',
		trim: true,
	},
	username: {
		in: 'body',
		isString: true,
		notEmpty: true,
		errorMessage: 'User username is required',
		trim: true,
		custom: {
			options: async (value) => {
				const user = await db
					.select()
					.from(usersTable)
					.where(eq(usersTable.username, value));
				if (user.length > 0) {
					throw new Error('User username already exists');
				}
				return true;
			},
		},
	},
	password: {
		in: 'body',
		isString: true,
		notEmpty: true,
		errorMessage: 'User password is required',
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
		errorMessage: 'User email is required',
		trim: true,
	},
	phone: {
		in: 'body',
		isString: true,
		notEmpty: true,
		errorMessage: 'User phone is required',
		trim: true,
	},
	countryId: {
		in: 'body',
		isInt: true,
		notEmpty: true,
		errorMessage: 'User country id is required',
	},
	regionId: {
		in: 'body',
		isInt: true,
		notEmpty: true,
		errorMessage: 'User region id is required',
	},
	cityId: {
		in: 'body',
		isInt: true,
		notEmpty: true,
		errorMessage: 'User city id is required',
	},
	roleId: {
		in: 'body',
		isInt: true,
		notEmpty: true,
		errorMessage: 'User role id is required',
	},
};

const updateSchema = {
	...createSchema,
	...deleteSchema,
};

export const createValidator = checkSchema(createSchema);
export const updateValidator = checkSchema(updateSchema);
export const deleteValidator = checkSchema(deleteSchema);
