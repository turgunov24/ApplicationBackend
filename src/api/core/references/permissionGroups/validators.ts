import { referencesPermissionGroupsTable } from '../../../../db/schemas/references/permissionGroups';
import { checkSchema, ParamSchema } from 'express-validator';
import { and, eq, InferInsertModel, ne } from 'drizzle-orm';
import db from '../../../../db';
import { getAuthUserId } from '../../../../utils/getAuthUserId';
import { Request } from 'express';
import { SUPER_ADMIN_ID } from '../../../../helpers/config';

export type CreatePayload = Pick<
	InferInsertModel<typeof referencesPermissionGroupsTable>,
	'nameUz' | 'nameRu'
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
					const permissionGroup = await db
						.select()
						.from(referencesPermissionGroupsTable)
						.where(eq(referencesPermissionGroupsTable.id, value));

					if (!permissionGroup.length)
						throw new Error('Permission group not found');

					const userId = getAuthUserId(req as Request);

					if (userId === SUPER_ADMIN_ID) return true;

					if (permissionGroup[0].createdBy !== userId)
						throw new Error(
							'You are not allowed to modify this permission group',
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
		errorMessage: 'Permission group id is required',
		custom: {
			options: async (value, { req }) => {
				const permissionGroup = await db
					.select()
					.from(referencesPermissionGroupsTable)
					.where(eq(referencesPermissionGroupsTable.id, value));

				if (!permissionGroup.length)
					throw new Error('Permission group not found');

				const userId = getAuthUserId(req as Request);

				if (userId === SUPER_ADMIN_ID) return true;

				if (permissionGroup[0].createdBy !== userId)
					throw new Error(
						'You are not allowed to modify this permission group',
					);

				return true;
			},
		},
	},
};

const createSchema: CreateValidationSchema = {
	nameUz: {
		in: 'body',
		isString: true,
		notEmpty: true,
		errorMessage: 'Permission group nameUz is required',
		trim: true,
	},
	nameRu: {
		in: 'body',
		isString: true,
		optional: true,
		errorMessage: 'Permission group nameRu is required',
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
