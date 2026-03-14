import { checkSchema, ParamSchema } from 'express-validator';
import { eq, InferInsertModel } from 'drizzle-orm';
import { referencesLegalFormsTable } from '../../../../db/schemas/references/legalForms';
import db from '../../../../db';
import { getAuthUserId } from '../../../../utils/getAuthUserId';
import { Request } from 'express';
import { SUPER_ADMIN_ID } from '../../../../helpers/config';

export type CreatePayload = Pick<
	InferInsertModel<typeof referencesLegalFormsTable>,
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
					const legalForm = await db
						.select()
						.from(referencesLegalFormsTable)
						.where(eq(referencesLegalFormsTable.id, value));

					if (!legalForm.length)
						throw new Error('Legal form not found');
					const userId = getAuthUserId(req as Request);

					if (userId === SUPER_ADMIN_ID) return true;

					if (legalForm[0].createdBy !== userId)
						throw new Error(
							'You are not allowed to view this legal form',
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
		errorMessage: 'Legal form id is required',
		custom: {
			options: async (value, { req }) => {
				const legalForm = await db
					.select()
					.from(referencesLegalFormsTable)
					.where(eq(referencesLegalFormsTable.id, value));

				if (!legalForm.length) throw new Error('Legal form not found');
				const userId = getAuthUserId(req as Request);

				if (userId === SUPER_ADMIN_ID) return true;

				if (legalForm[0].createdBy !== userId)
					throw new Error(
						'You are not allowed to modify this legal form',
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
		errorMessage: 'Legal form name is required',
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
