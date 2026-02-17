import { referencesDistrictsTable } from '../../../../db/schemas/references/districts';
import { checkSchema, ParamSchema } from 'express-validator';
import { eq, InferInsertModel } from 'drizzle-orm';
import db from '../../../../db';
import { referencesRegionsTable } from '../../../../db/schemas/references/regions';
import { getAuthUserId } from '../../../../utils/getAuthUserId';
import { Request } from 'express';
import { SUPER_ADMIN_ID } from '../../../../helpers/config';

export type CreatePayload = Pick<
	InferInsertModel<typeof referencesDistrictsTable>,
	'nameUz' | 'nameRu' | 'regionId'
>;

type keys = keyof CreatePayload;

export type CreateValidationSchema = Record<keys, ParamSchema>;
export type DeleteValidationSchema = Record<'id', ParamSchema>;
export type ListValidationSchema = Record<'regionId', ParamSchema>;
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
					const district = await db
						.select()
						.from(referencesDistrictsTable)
						.where(eq(referencesDistrictsTable.id, value));

					if (!district.length) throw new Error('District not found');
					const userId = getAuthUserId(req as Request);

					if (userId === SUPER_ADMIN_ID) return true;

					if (district[0].createdBy !== userId)
						throw new Error('You are not allowed to modify this district');
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
		errorMessage: 'District id is required',
		custom: {
			options: async (value, { req }) => {
				const district = await db
					.select()
					.from(referencesDistrictsTable)
					.where(eq(referencesDistrictsTable.id, value));

				if (!district.length) throw new Error('District not found');
				const userId = getAuthUserId(req as Request);

				if (userId === SUPER_ADMIN_ID) return true;

				if (district[0].createdBy !== userId)
					throw new Error('You are not allowed to modify this district');

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
		errorMessage: 'District nameUz is required',
		trim: true,
	},
	nameRu: {
		in: 'body',
		isString: true,
		optional: true,
		errorMessage: 'District nameRu is required',
		trim: true,
	},
	regionId: {
		in: 'body',
		isInt: true,
		notEmpty: true,
		errorMessage: 'Region id is required',
		custom: {
			options: async (value, { req }) => {
				const region = await db
					.select()
					.from(referencesRegionsTable)
					.where(eq(referencesRegionsTable.id, value));

				if (!region.length) throw new Error('Region not found');
				const userId = getAuthUserId(req as Request);

				if (userId === SUPER_ADMIN_ID) return true;

				if (region[0].createdBy !== userId)
					throw new Error('You are not allowed to access this region');

				return true;
			},
		},
	},
};

const listSchema: ListValidationSchema = {
	regionId: {
		in: 'query',
		isInt: true,
		optional: true,
		custom: {
			options: async (value, { req }) => {
				if (value) {
					const region = await db
						.select()
						.from(referencesRegionsTable)
						.where(eq(referencesRegionsTable.id, value));

					if (!region.length) throw new Error('Region not found');
					const userId = getAuthUserId(req as Request);

					if (userId === SUPER_ADMIN_ID) return true;

					if (region[0].createdBy !== userId)
						throw new Error('You are not allowed to access this region');
				}

				return true;
			},
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
export const listValidator = checkSchema(listSchema);
