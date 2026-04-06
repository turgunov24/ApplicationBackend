import { referencesTaskRecurrenceTable } from '../../../../db/schemas/references/taskRecurrence';
import { checkSchema, ParamSchema } from 'express-validator';
import { eq, InferInsertModel } from 'drizzle-orm';
import db from '../../../../db';
import { getAuthUserId } from '../../../../utils/getAuthUserId';
import { Request } from 'express';
import { SUPER_ADMIN_ID } from '../../../../helpers/config';

export type CreatePayload = Pick<
	InferInsertModel<typeof referencesTaskRecurrenceTable>,
	'translationKey' | 'token' | 'description'
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
					const taskRecurrence = await db
						.select()
						.from(referencesTaskRecurrenceTable)
						.where(eq(referencesTaskRecurrenceTable.id, value));

					if (!taskRecurrence.length) throw new Error('Task recurrence not found');
					const userId = getAuthUserId(req as Request);

					if (userId === SUPER_ADMIN_ID) return true;

					if (taskRecurrence[0].createdBy !== userId)
						throw new Error('You are not allowed to modify this task recurrence');
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
		errorMessage: 'Task recurrence id is required',
		custom: {
			options: async (value, { req }) => {
				const taskRecurrence = await db
					.select()
					.from(referencesTaskRecurrenceTable)
					.where(eq(referencesTaskRecurrenceTable.id, value));

				if (!taskRecurrence.length) throw new Error('Task recurrence not found');
				const userId = getAuthUserId(req as Request);

				if (userId === SUPER_ADMIN_ID) return true;

				if (taskRecurrence[0].createdBy !== userId)
					throw new Error('You are not allowed to modify this task recurrence');

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
		errorMessage: 'Task recurrence translationKey is required',
		trim: true,
	},
	token: {
		in: 'body',
		isString: true,
		notEmpty: true,
		errorMessage: 'Task recurrence token is required',
		trim: true,
	},
	description: {
		in: 'body',
		isString: true,
		optional: true,
		errorMessage: 'Task recurrence description is required',
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
