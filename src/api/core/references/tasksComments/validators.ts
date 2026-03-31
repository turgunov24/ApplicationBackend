import { referencesTasksCommentsTable } from '../../../../db/schemas/references/tasksComments';
import { checkSchema, ParamSchema } from 'express-validator';
import { eq, InferInsertModel } from 'drizzle-orm';
import db from '../../../../db';
import { getAuthUserId } from '../../../../utils/getAuthUserId';
import { Request } from 'express';
import { SUPER_ADMIN_ID } from '../../../../helpers/config';

export type CreatePayload = Pick<
	InferInsertModel<typeof referencesTasksCommentsTable>,
	'text' | 'taskId'
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
					const tasksComment = await db
						.select()
						.from(referencesTasksCommentsTable)
						.where(eq(referencesTasksCommentsTable.id, value));

					if (!tasksComment.length) throw new Error('Tasks comment not found');
					const userId = getAuthUserId(req as Request);

					if (userId === SUPER_ADMIN_ID) return true;

					if (tasksComment[0].createdBy !== userId)
						throw new Error('You are not allowed to modify this tasks comment');
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
		errorMessage: 'Tasks comment id is required',
		custom: {
			options: async (value, { req }) => {
				const tasksComment = await db
					.select()
					.from(referencesTasksCommentsTable)
					.where(eq(referencesTasksCommentsTable.id, value));

				if (!tasksComment.length) throw new Error('Tasks comment not found');
				const userId = getAuthUserId(req as Request);

				if (userId === SUPER_ADMIN_ID) return true;

				if (tasksComment[0].createdBy !== userId)
					throw new Error('You are not allowed to modify this tasks comment');

				return true;
			},
		},
	},
};

const createSchema: CreateValidationSchema = {
	text: {
		in: 'body',
		isString: true,
		notEmpty: true,
		errorMessage: 'Tasks comment text is required',
		trim: true,
	},
	taskId: {
		in: 'body',
		isInt: true,
		notEmpty: true,
		errorMessage: 'Tasks comment taskId is required',
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
