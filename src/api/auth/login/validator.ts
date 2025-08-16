import { checkSchema, ParamSchema } from 'express-validator';
import { usersTable } from '../../../db/schemas/users';
import { InferInsertModel } from 'drizzle-orm';

export type LoginPayload = Pick<
	InferInsertModel<typeof usersTable>,
	'username' | 'password'
>;
type keys = keyof LoginPayload;

export type LoginValidationSchema = Record<keys, ParamSchema>;

export const loginSchema: LoginValidationSchema = {
	username: {
		in: 'body',
		isString: true,
		isLength: {
			options: { min: 3, max: 50 },
			errorMessage: 'Username must be between 3 and 50 characters',
		},
		notEmpty: true,
		errorMessage: 'Username is required',
	},
	password: {
		in: 'body',
		isString: true,
		isLength: {
			options: { min: 4, max: 20 },
			errorMessage: 'Password must be between 4 and 20 characters',
		},
		notEmpty: true,
		errorMessage: 'Password is required',
	},
};

export const loginValidator = checkSchema(loginSchema);