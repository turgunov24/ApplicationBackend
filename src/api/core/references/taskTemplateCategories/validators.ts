import { referencesTaskTemplateCategoriesTable } from '../../../../db/schemas/references/taskTemplateCategories';
import { checkSchema, ParamSchema } from 'express-validator';
import { eq, InferInsertModel } from 'drizzle-orm';
import db from '../../../../db';
import { getAuthUserId } from '../../../../utils/getAuthUserId';
import { Request } from 'express';
import { SUPER_ADMIN_ID } from '../../../../helpers/config';

export type CreatePayload = Pick<
	InferInsertModel<typeof referencesTaskTemplateCategoriesTable>,
	'translationKey'
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
					const taskTemplateCategory = await db
						.select()
						.from(referencesTaskTemplateCategoriesTable)
						.where(eq(referencesTaskTemplateCategoriesTable.id, value));

					if (!taskTemplateCategory.length) throw new Error('Task template category not found');
					const userId = getAuthUserId(req as Request);

					if (userId === SUPER_ADMIN_ID) return true;

					if (taskTemplateCategory[0].createdBy !== userId)
						throw new Error('You are not allowed to modify this task template category');
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
		errorMessage: 'Task template category id is required',
		custom: {
			options: async (value, { req }) => {
				const taskTemplateCategory = await db
					.select()
					.from(referencesTaskTemplateCategoriesTable)
					.where(eq(referencesTaskTemplateCategoriesTable.id, value));

				if (!taskTemplateCategory.length) throw new Error('Task template category not found');
				const userId = getAuthUserId(req as Request);

				if (userId === SUPER_ADMIN_ID) return true;

				if (taskTemplateCategory[0].createdBy !== userId)
					throw new Error('You are not allowed to modify this task template category');

				return true;
			},
		},
	},
};

const createSchema: CreateValidationSchema = {
	translationKey: {
		in: 'body',
		isString: true,
		notEmpty: true,
		errorMessage: 'Task template category translationKey is required',
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
