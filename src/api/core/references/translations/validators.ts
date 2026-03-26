import { referencesTranslationsTable } from '../../../../db/schemas/references/translations';
import { checkSchema, ParamSchema } from 'express-validator';
import { eq, InferInsertModel, and } from 'drizzle-orm';
import db from '../../../../db';
import { getAuthUserId } from '../../../../utils/getAuthUserId';
import { Request } from 'express';
import { SUPER_ADMIN_ID } from '../../../../helpers/config';

export type CreatePayload = Pick<
	InferInsertModel<typeof referencesTranslationsTable>,
	'lang' | 'namespace' | 'key' | 'value'
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
						.from(referencesTranslationsTable)
						.where(eq(referencesTranslationsTable.id, value));

					if (!translation.length) throw new Error('Translation not found');
					const userId = getAuthUserId(req as Request);

					if (userId === SUPER_ADMIN_ID) return true;

					if (translation[0].createdBy !== userId)
						throw new Error('You are not allowed to modify this translation');
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
		errorMessage: 'Translation id is required',
		custom: {
			options: async (value, { req }) => {
				const translation = await db
					.select()
					.from(referencesTranslationsTable)
					.where(eq(referencesTranslationsTable.id, value));

				if (!translation.length) throw new Error('Translation not found');
				const userId = getAuthUserId(req as Request);

				if (userId === SUPER_ADMIN_ID) return true;

				if (translation[0].createdBy !== userId)
					throw new Error('You are not allowed to modify this translation');

				return true;
			},
		},
	},
};

const createSchema: CreateValidationSchema = {
	lang: {
		in: 'body',
		isString: true,
		notEmpty: true,
		errorMessage: 'Translation lang is required',
		trim: true,
	},
	namespace: {
		in: 'body',
		isString: true,
		notEmpty: true,
		errorMessage: 'Translation namespace is required',
		trim: true,
	},
	key: {
		in: 'body',
		isString: true,
		notEmpty: true,
		errorMessage: 'Translation key is required',
		trim: true,
	},
	value: {
		in: 'body',
		isString: true,
		notEmpty: true,
		errorMessage: 'Translation value is required',
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
