import { checkSchema, ParamSchema } from 'express-validator';
import { eq, InferInsertModel } from 'drizzle-orm';
import { referencesServicesTable } from '../../../../db/schemas/references/services';
import db from '../../../../db';
import { getAuthUserId } from '../../../../utils/getAuthUserId';
import { Request } from 'express';
import { SUPER_ADMIN_ID } from '../../../../helpers/config';

export type CreatePayload = Pick<
	InferInsertModel<typeof referencesServicesTable>,
	'name'
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
					const service = await db
						.select()
						.from(referencesServicesTable)
						.where(eq(referencesServicesTable.id, value));

					if (!service.length)
						throw new Error('Service not found');
					const userId = getAuthUserId(req as Request);

					if (userId === SUPER_ADMIN_ID) return true;

					if (service[0].createdBy !== userId)
						throw new Error(
							'You are not allowed to view this service',
						);
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
		errorMessage: 'Service id is required',
		custom: {
			options: async (value, { req }) => {
				const service = await db
					.select()
					.from(referencesServicesTable)
					.where(eq(referencesServicesTable.id, value));

				if (!service.length) throw new Error('Service not found');
				const userId = getAuthUserId(req as Request);

				if (userId === SUPER_ADMIN_ID) return true;

				if (service[0].createdBy !== userId)
					throw new Error(
						'You are not allowed to modify this service',
					);

				return true;
			},
		},
	},
};

const createSchema: CreateValidationSchema = {
	name: {
		in: 'body',
		isString: true,
		notEmpty: true,
		errorMessage: 'Service name is required',
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
