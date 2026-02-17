import { checkSchema } from 'express-validator';
import { and, inArray, InferInsertModel, ne, eq } from 'drizzle-orm';
import {
	referencesRolesPermissionsTable,
	referencesRolesTable,
} from '../../../../db/schemas';
import db from '../../../../db';
import { getAuthUserId } from '../../../../utils/getAuthUserId';
import { SUPER_ADMIN_ID } from '../../../../helpers/config';
import { Request } from 'express';

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
			options: async (
				value: UpdateRolePermissionsPayload['values'],
				{ req },
			) => {
				const roleIds = value.map((rp) => rp.roleId);

				const userId = getAuthUserId(req as Request);

				if (!userId) throw new Error('Unauthorized');

				const whereConditions = [
					ne(referencesRolesTable.status, 'deleted'),
					inArray(referencesRolesTable.id, roleIds),
				];

				if (userId !== SUPER_ADMIN_ID) {
					whereConditions.push(eq(referencesRolesTable.createdBy, userId));
				}

				const existingRoles = await db
					.select({ id: referencesRolesTable.id })
					.from(referencesRolesTable)
					.where(and(...whereConditions));

				if (existingRoles.length !== roleIds.length) {
					throw new Error(
						'One or more roles not found or you do not have permission to modify them',
					);
				}

				return true;
			},
		},
	},
});
