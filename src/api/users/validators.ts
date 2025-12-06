import { usersTable } from '../../db/schemas/users';
import { checkSchema, ParamSchema } from 'express-validator';
import { and, eq, inArray, InferInsertModel, ne } from 'drizzle-orm';
import db from '../../db';
import { referencesRolesTable } from '../../db/schemas';

export type CreatePayload = Pick<
	InferInsertModel<typeof usersTable>,
	| 'fullName'
	| 'username'
	| 'password'
	| 'email'
	| 'phone'
	| 'countryId'
	| 'regionId'
	| 'districtId'
> & {
	roles: number[];
};

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
					const user = await db
						.select()
						.from(usersTable)
						.where(eq(usersTable.id, value));

					if (!user.length) throw new Error('User not found');
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
		errorMessage: 'User id is required',
		custom: {
			options: async (value) => {
				const user = await db
					.select()
					.from(usersTable)
					.where(eq(usersTable.id, value));

				if (!user.length) throw new Error('User not found');

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
		custom: {
			options: async (value) => {
				const user = await db
					.select()
					.from(usersTable)
					.where(eq(usersTable.email, value));
				if (user.length > 0) {
					throw new Error('User email already exists');
				}
				return true;
			},
		},
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
	districtId: {
		in: 'body',
		isInt: true,
		notEmpty: true,
		errorMessage: 'User district id is required',
	},
	roles: {
		in: 'body',
		notEmpty: true,
		errorMessage: 'User roles are required',
		custom: {
			options: async (value: CreatePayload['roles']) => {
				if (Array.isArray(value)) {
					const existingRoles = await db
						.select({ id: referencesRolesTable.id })
						.from(referencesRolesTable)
						.where(
							and(
								ne(referencesRolesTable.status, 'deleted'),
								inArray(referencesRolesTable.id, value)
							)
						);

					if (existingRoles.length !== value.length) {
						throw new Error('One or more roles not found or Invalid roleId');
					}
				}

				throw new Error('User roles are invalid');
			},
		},
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
		errorMessage: 'User username is required',
		trim: true,
		custom: {
			options: async (value, { req }) => {
				const { id } = req.query as { id: string };

				if (!id) {
					throw new Error('User id not provided');
				}
				const users = await db
					.select()
					.from(usersTable)
					.where(
						and(eq(usersTable.username, value), ne(usersTable.id, parseInt(id)))
					);

				if (users.length > 0) throw new Error('User username already exists');

				return true;
			},
		},
	},
	email: {
		in: 'body',
		isEmail: true,
		notEmpty: true,
		errorMessage: 'User email is required',
		trim: true,
		custom: {
			options: async (value, { req }) => {
				const { id } = req.query as { id: string };

				if (!id) {
					throw new Error('User id not provided');
				}
				const users = await db
					.select()
					.from(usersTable)
					.where(
						and(eq(usersTable.email, value), ne(usersTable.id, parseInt(id)))
					);

				if (users.length > 0) throw new Error('User email already exists');

				return true;
			},
		},
	},
};

export const createValidator = checkSchema(createSchema);
export const updateValidator = checkSchema(updateSchema);
export const deleteValidator = checkSchema(deleteSchema);
export const indexValidator = checkSchema(indexSchema);
export const uploadAvatarValidator = checkSchema(deleteSchema)
