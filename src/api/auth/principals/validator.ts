import { checkSchema, ParamSchema } from 'express-validator';
import { principalsTable } from '../../../db/schemas/principals';
import { InferInsertModel } from 'drizzle-orm';

export type PrincipalLoginPayload = Pick<
	InferInsertModel<typeof principalsTable>,
	'username' | 'password'
>;
type keys = keyof PrincipalLoginPayload;

export type PrincipalLoginValidationSchema = Record<keys, ParamSchema>;

export const principalLoginSchema: PrincipalLoginValidationSchema = {
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

export const principalLoginValidator = checkSchema(principalLoginSchema);
