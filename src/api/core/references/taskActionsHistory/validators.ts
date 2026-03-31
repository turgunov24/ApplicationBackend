import { referencesTaskActionsHistoryTable } from '../../../../db/schemas/references/taskActionsHistory';
import { checkSchema, ParamSchema } from 'express-validator';
import { eq, InferInsertModel } from 'drizzle-orm';
import db from '../../../../db';
import { getAuthUserId } from '../../../../utils/getAuthUserId';
import { Request } from 'express';
import { SUPER_ADMIN_ID } from '../../../../helpers/config';

export type CreatePayload = Pick<
	InferInsertModel<typeof referencesTaskActionsHistoryTable>,
	'taskId' | 'type' | 'status'
>;

const indexSchema: Record<'id', ParamSchema> = {
	id: {
		in: 'query',
		isInt: true,
		optional: true,
		custom: {
			options: async (value, { req }) => {
				if (value) {
					const taskActionsHistory = await db
						.select()
						.from(referencesTaskActionsHistoryTable)
						.where(eq(referencesTaskActionsHistoryTable.id, value));

					if (!taskActionsHistory.length) throw new Error('Task actions history not found');
					const userId = getAuthUserId(req as Request);

					if (userId === SUPER_ADMIN_ID) return true;

					if (taskActionsHistory[0].createdBy !== userId)
						throw new Error('You are not allowed to modify this task actions history');
				}

				return true;
			},
		},
	},
};

const changeStatusSchema: Record<keyof CreatePayload, ParamSchema> = {
	taskId: {
		in: 'body',
		isInt: true,
		notEmpty: true,
		errorMessage: 'Task actions history taskId is required',
	},
	type: {
		in: 'body',
		isString: true,
		notEmpty: true,
		errorMessage: 'Task actions history type is required',
		trim: true,
	},
	status: {
		in: 'body',
		isString: true,
		notEmpty: true,
		errorMessage: 'Task actions history status is required',
		trim: true,
	},
};

export const indexValidator = checkSchema(indexSchema);
export const changeStatusValidator = checkSchema(changeStatusSchema);
