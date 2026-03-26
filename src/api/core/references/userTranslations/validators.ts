import { referencesUserTranslationsTable } from '../../../../db/schemas/references/userTranslations';
import { checkSchema, ParamSchema } from 'express-validator';
import { eq, InferInsertModel, and } from 'drizzle-orm';
import db from '../../../../db';
import { getAuthUserId } from '../../../../utils/getAuthUserId';
import { Request } from 'express';
import { SUPER_ADMIN_ID } from '../../../../helpers/config';

export type CreatePayload = Pick<
	InferInsertModel<typeof referencesUserTranslationsTable>,
	'userId' | 'lang' | 'namespace' | 'key' | 'value'
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
					const translation = await db
						.select()
						.from(referencesUserTranslationsTable)
						.where(eq(referencesUserTranslationsTable.id, value));

					if (!translation.length) throw new Error('User translation not found');
					const userId = getAuthUserId(req as Request);

					if (userId === SUPER_ADMIN_ID) return true;

					if (translation[0].createdBy !== userId)
						throw new Error('You are not allowed to modify this user translation');
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
		errorMessage: 'User translation id is required',
		custom: {
			options: async (value, { req }) => {
				const translation = await db
					.select()
					.from(referencesUserTranslationsTable)
					.where(eq(referencesUserTranslationsTable.id, value));

				if (!translation.length) throw new Error('User translation not found');
				const userId = getAuthUserId(req as Request);

				if (userId === SUPER_ADMIN_ID) return true;

				if (translation[0].createdBy !== userId)
					throw new Error('You are not allowed to modify this user translation');

				return true;
			},
		},
	},
};

const createSchema: CreateValidationSchema = {
	userId: {
		in: 'body',
		isInt: true,
		notEmpty: true,
		errorMessage: 'User translation userId is required',
	},
	lang: {
		in: 'body',
		isString: true,
		notEmpty: true,
		errorMessage: 'User translation lang is required',
		trim: true,
	},
	namespace: {
		in: 'body',
		isString: true,
		notEmpty: true,
		errorMessage: 'User translation namespace is required',
		trim: true,
	},
	key: {
		in: 'body',
		isString: true,
		notEmpty: true,
		errorMessage: 'User translation key is required',
		trim: true,
	},
	value: {
		in: 'body',
		isString: true,
		notEmpty: true,
		errorMessage: 'User translation value is required',
		trim: true,
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
