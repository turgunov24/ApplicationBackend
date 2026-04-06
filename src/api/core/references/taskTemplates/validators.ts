import { referencesTaskTemplatesTable } from '../../../../db/schemas/references/taskTemplates';
import { checkSchema, ParamSchema } from 'express-validator';
import { eq, InferInsertModel } from 'drizzle-orm';
import db from '../../../../db';
import { getAuthUserId } from '../../../../utils/getAuthUserId';
import { Request } from 'express';
import { SUPER_ADMIN_ID } from '../../../../helpers/config';

export type CreatePayload = Pick<
	InferInsertModel<typeof referencesTaskTemplatesTable>,
	'translationKey' | 'description' | 'recurrenceId' | 'taskTemplateCategoryId' | 'date' | 'dayOfMonth' | 'monthOfQuarter' | 'monthOfYear'
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
					const taskTemplate = await db
						.select()
						.from(referencesTaskTemplatesTable)
						.where(eq(referencesTaskTemplatesTable.id, value));

					if (!taskTemplate.length) throw new Error('Task template not found');
					const userId = getAuthUserId(req as Request);

					if (userId === SUPER_ADMIN_ID) return true;

					if (taskTemplate[0].createdBy !== userId)
						throw new Error('You are not allowed to modify this task template');
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
		errorMessage: 'Task template id is required',
		custom: {
			options: async (value, { req }) => {
				const taskTemplate = await db
					.select()
					.from(referencesTaskTemplatesTable)
					.where(eq(referencesTaskTemplatesTable.id, value));

				if (!taskTemplate.length) throw new Error('Task template not found');
				const userId = getAuthUserId(req as Request);

				if (userId === SUPER_ADMIN_ID) return true;

				if (taskTemplate[0].createdBy !== userId)
					throw new Error('You are not allowed to modify this task template');

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
		errorMessage: 'Task template translationKey is required',
		trim: true,
	},
	description: {
		in: 'body',
		isString: true,
		optional: true,
		errorMessage: 'Task template description is required',
		trim: true,
	},
	recurrenceId: {
		in: 'body',
		isInt: true,
		notEmpty: true,
		errorMessage: 'Task template recurrenceId is required',
	},
	taskTemplateCategoryId: {
		in: 'body',
		isInt: true,
		notEmpty: true,
		errorMessage: 'Task template taskTemplateCategoryId is required',
	},
	date: {
		in: 'body',
		optional: { options: { nullable: true } },
		isISO8601: true,
		errorMessage: 'Task template date must be a valid date',
	},
	dayOfMonth: {
		in: 'body',
		optional: { options: { nullable: true } },
		isInt: {
			options: { min: 1, max: 31 },
			errorMessage: 'dayOfMonth must be between 1 and 31',
		},
	},
	monthOfQuarter: {
		in: 'body',
		optional: { options: { nullable: true } },
		isInt: {
			options: { min: 1, max: 3 },
			errorMessage: 'monthOfQuarter must be between 1 and 3',
		},
	},
	monthOfYear: {
		in: 'body',
		optional: { options: { nullable: true } },
		isInt: {
			options: { min: 1, max: 12 },
			errorMessage: 'monthOfYear must be between 1 and 12',
		},
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
