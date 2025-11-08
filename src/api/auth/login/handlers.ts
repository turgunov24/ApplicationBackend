import { Request, Response } from 'express'
import { LoginPayload } from './validator'
import db from '../../../db'
import { usersTable } from '../../../db/schemas/users'
import { and, eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { generateErrorMessage } from '../../../utils/generateErrorMessage'
import { handleError } from '../../../utils/handleError'
import {
	referencesPermissionsTable,
	referencesRolesPermissionsTable,
	referencesRolesTable,
	usersRolesTable
} from '../../../db/schemas'

export const loginHandler = async (
	req: Request<{}, {}, LoginPayload>,
	res: Response
) => {
	try {
		const { username, password } = req.body;

		const user = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.username, username));

		if (!user[0]) {
			return res.status(400).json(generateErrorMessage('Invalid credentials'));
		}

		const validPassword = await bcrypt.compare(password, user[0].password);

		if (!validPassword) {
			return res.status(400).json(generateErrorMessage('Invalid credentials'));
		}

		const secret = process.env.JWT_SECRET;

		if (!secret) {
			return res
				.status(500)
				.json(generateErrorMessage('JWT_SECRET is not set'));
		}

		const accessToken = jwt.sign(
			{ id: user[0].id, username: user[0].username, email: user[0].email },
			secret,
			{ expiresIn: '1h' }
		);

		await db
			.update(usersTable)
			.set({ token: accessToken, status: 'active' })
			.where(eq(usersTable.id, user[0].id));

		const permissionMap = new Map<
			number,
			typeof referencesPermissionsTable.$inferSelect
		>();

		const roles = await db
			.select()
			.from(usersRolesTable)
			.innerJoin(
				referencesRolesTable,
				eq(usersRolesTable.roleId, referencesRolesTable.id)
			)
			.where(
				and(
					eq(usersRolesTable.userId, user[0].id),
					eq(referencesRolesTable.status, 'active')
				)
			);

		for (const role of roles) {
			const rolePermissions = await db
				.select({
					permission: referencesPermissionsTable,
					rolePermission: referencesRolesPermissionsTable,
				})
				.from(referencesRolesPermissionsTable)
				.innerJoin(
					referencesPermissionsTable,
					eq(
						referencesRolesPermissionsTable.permissionId,
						referencesPermissionsTable.id
					)
				)
				.where(
					and(
						eq(
							referencesRolesPermissionsTable.roleId,
							role.references_roles.id
						),
						eq(referencesPermissionsTable.status, 'active')
					)
				);

			for (const { permission } of rolePermissions) {
				permissionMap.set(permission.id, permission);
			}
		}

		const permissions = Array.from(permissionMap.values());

		return res.status(200).json({ accessToken, user: user[0], permissions });
	} catch (error: unknown) {
		handleError(res, error);
	}
};
