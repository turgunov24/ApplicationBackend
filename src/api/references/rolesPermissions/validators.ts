import { checkSchema } from 'express-validator';
import { and, inArray, InferInsertModel, ne } from 'drizzle-orm';
import {
	referencesRolesPermissionsTable,
	referencesRolesTable,
} from '../../../db/schemas';
import db from '../../../db';

type RolesPermissionsTableType = InferInsertModel<
	typeof referencesRolesPermissionsTable
>;

export interface UpdateRolePermissionsPayload {
	values: Array<{
		roleId: RolesPermissionsTableType['roleId'];
		permissionIds: Array<RolesPermissionsTableType['permissionId']>;
	}>;
}

export const updateRolePermissionsValidator = checkSchema({
	values: {
		isArray: {
			errorMessage: 'Values must be an array',
			bail: true,
		},
		custom: {
			options: async (value: UpdateRolePermissionsPayload['values']) => {
				const roleIds = value.map((rp) => rp.roleId);

				const existingRoles = await db
					.select({ id: referencesRolesTable.id })
					.from(referencesRolesTable)
					.where(
						and(
							ne(referencesRolesTable.status, 'deleted'),
							inArray(referencesRolesTable.id, roleIds)
						)
					);

				if (existingRoles.length !== roleIds.length) {
					throw new Error('One or more roles not found or Invalid roleId');
				}

				return true;
			},
		},
	},
});
