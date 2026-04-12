import { checkSchema, ParamSchema } from 'express-validator';
import { eq, InferInsertModel, and } from 'drizzle-orm';
import db from '../../../../db';
import { getAuthUserId } from '../../../../utils/getAuthUserId';
import { Request } from 'express';
import { SUPER_ADMIN_ID } from '../../../../helpers/config';
import { referencesAttachTemplateToTaskTable } from '../../../../db/schemas/references/attachTemplateToTask';
import { referencesTaskTemplatesTable } from '../../../../db/schemas/references/taskTemplates';
import { inArray, ne } from 'drizzle-orm';

export type CreatePayload = Pick<
	InferInsertModel<typeof referencesAttachTemplateToTaskTable>,
	'principalCustomerId' | 'startDate' | 'endDate'
> & { taskTemplateIds: number[] };

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
					const record = await db
						.select()
						.from(referencesAttachTemplateToTaskTable)
						.where(eq(referencesAttachTemplateToTaskTable.id, value));

					if (!record.length)
						throw new Error('Attach template to task not found');
					const userId = getAuthUserId(req as Request);

					if (userId === SUPER_ADMIN_ID) return true;

					if (record[0].createdBy !== userId)
						throw new Error('You are not allowed to modify this record');
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
		errorMessage: 'Attach template to task id is required',
		custom: {
			options: async (value, { req }) => {
				const record = await db
					.select()
					.from(referencesAttachTemplateToTaskTable)
					.where(eq(referencesAttachTemplateToTaskTable.id, value));

				if (!record.length)
					throw new Error('Attach template to task not found');
				const userId = getAuthUserId(req as Request);

				if (userId === SUPER_ADMIN_ID) return true;

				if (record[0].createdBy !== userId)
					throw new Error('You are not allowed to modify this record');

				return true;
			},
		},
	},
};

const createSchema: CreateValidationSchema = {
	principalCustomerId: {
		in: 'body',
		isInt: true,
		notEmpty: true,
		errorMessage: 'Principal customer id is required',
	},
	taskTemplateIds: {
		in: 'body',
		notEmpty: {
			errorMessage: 'Task template ids are required',
			bail: true,
		},
		isArray: {
			errorMessage: 'Task template ids must be an array',
			bail: true,
		},
		custom: {
			options: async (value: number[]) => {
				const existingTemplates =
					await db.query.referencesTaskTemplatesTable.findMany({
						where: and(
							ne(referencesTaskTemplatesTable.status, 'deleted'),
							inArray(referencesTaskTemplatesTable.id, value),
						),
					});

				if (existingTemplates.length !== value.length) {
					throw new Error('One or more task templates not found or invalid');
				}
			},
		},
	},
	startDate: {
		in: 'body',
		notEmpty: true,
		isISO8601: true,
		errorMessage: 'Invalid start date format (must be ISO8601 date)',
	},
	endDate: {
		in: 'body',
		notEmpty: true,
		isISO8601: true,
		errorMessage: 'Invalid end date format (must be ISO8601 date)',
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
