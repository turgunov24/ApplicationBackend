import { referencesTasksTable } from '../../../../db/schemas/references/tasks';
import { checkSchema, ParamSchema } from 'express-validator';
import { eq, InferInsertModel } from 'drizzle-orm';
import db from '../../../../db';
import { getAuthUserId } from '../../../../utils/getAuthUserId';
import { Request } from 'express';
import { SUPER_ADMIN_ID } from '../../../../helpers/config';

export type CreatePayload = Pick<
	InferInsertModel<typeof referencesTasksTable>,
	'translationKey' | 'description' | 'deadline' | 'principalCustomerId'
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
					const task = await db
						.select()
						.from(referencesTasksTable)
						.where(eq(referencesTasksTable.id, value));

					if (!task.length) throw new Error('Task not found');
					const userId = getAuthUserId(req as Request);

					if (userId === SUPER_ADMIN_ID) return true;

					if (task[0].createdBy !== userId)
						throw new Error('You are not allowed to modify this task');
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
		errorMessage: 'Task id is required',
		custom: {
			options: async (value, { req }) => {
				const task = await db
					.select()
					.from(referencesTasksTable)
					.where(eq(referencesTasksTable.id, value));

				if (!task.length) throw new Error('Task not found');
				const userId = getAuthUserId(req as Request);

				if (userId === SUPER_ADMIN_ID) return true;

				if (task[0].createdBy !== userId)
					throw new Error('You are not allowed to modify this task');

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
		errorMessage: 'Task translationKey is required',
		trim: true,
	},
	description: {
		in: 'body',
		isString: true,
		optional: true,
		errorMessage: 'Task description is required',
		trim: true,
	},
	deadline: {
		in: 'body',
		optional: true,
		isISO8601: true,
		errorMessage: 'Task deadline must be a valid date',
	},
	principalCustomerId: {
		in: 'body',
		isInt: true,
		notEmpty: true,
		errorMessage: 'Task principalCustomerId is required',
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
