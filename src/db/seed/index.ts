import 'dotenv/config';
import { reset } from 'drizzle-seed';
import * as schemas from '../schemas/index';
import 'dotenv/config';
import db from '../index';
import { logger } from '../../utils/logger';
import { countries } from './referenceCountries';
import { roles } from './referenceRoles';
import { permissionGroups } from './referencePermissionGroup';
import { permissions } from './referencePermissions';
import {
	REFERENCES_COUNTRIES_CONTROLLER,
	REFERENCES_DISTRICTS_CONTROLLER,
	REFERENCES_PERMISSION_GROUPS_CONTROLLER,
	REFERENCES_PERMISSIONS_CONTROLLER,
	REFERENCES_REGIONS_CONTROLLER,
	REFERENCES_RESOURCES_CONTROLLER,
	REFERENCES_ROLES_CONTROLLER,
	REFERENCES_ROLES_PERMISSIONS_CONTROLLER,
	USERS_CONTROLLER,
} from '../../helpers/endPoints';
import { eq } from 'drizzle-orm';
import { ResourceActions } from '../../types/auth';
import { users } from './users';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

async function main() {
	try {
		logger.info('RESET DATABASE ♻️');
		await reset(db, schemas);
		logger.info('SUCCESSFULLY RESET DATABASE ✅');

		for (const country of countries) {
			logger.info(`🌱 SEED STARTED FOR: ${country.nameUz}`);
			const newCountry = await db
				.insert(schemas.referencesCountriesTable)
				.values({
					nameRu: country.nameRu,
					nameUz: country.nameUz,
				})
				.returning({ id: schemas.referencesCountriesTable.id });

			for (const region of country.regions) {
				const newRegion = await db
					.insert(schemas.referencesRegionsTable)
					.values({
						nameRu: region.nameRu,
						nameUz: region.nameUz,
						countryId: newCountry[0].id,
					})
					.returning({ id: schemas.referencesRegionsTable.id });

				for (const district of region.districts) {
					await db.insert(schemas.referencesDistrictsTable).values({
						regionId: newRegion[0].id,
						nameRu: district.nameRu,
						nameUz: district.nameUz,
					});
				}
			}
		}

		for (const permissionGroup of permissionGroups) {
			await db
				.insert(schemas.referencesPermissionGroupsTable)
				.values({
					nameRu: permissionGroup.nameRu,
					nameUz: permissionGroup.nameUz,
				})
				.returning({ id: schemas.referencesPermissionGroupsTable.id });
		}

		for (const permission of permissions) {
			if (permission.resource.startsWith(REFERENCES_COUNTRIES_CONTROLLER)) {
				const permissionGroup = await db
					.select()
					.from(schemas.referencesPermissionGroupsTable)
					.where(
						eq(
							schemas.referencesPermissionGroupsTable.nameUz,
							"Mamlakatlar ma'lumotnomalari"
						)
					);

				await db.insert(schemas.referencesPermissionsTable).values({
					nameRu: permission.nameRu,
					nameUz: permission.nameUz,
					resource: permission.resource,
					action: permission.action,
					permissionGroupId: permissionGroup[0].id,
				});

				continue;
			}

			if (permission.resource.startsWith(REFERENCES_REGIONS_CONTROLLER)) {
				const permissionGroup = await db
					.select()
					.from(schemas.referencesPermissionGroupsTable)
					.where(
						eq(
							schemas.referencesPermissionGroupsTable.nameUz,
							"Viloyatlar ma'lumotnomalari"
						)
					);

				await db.insert(schemas.referencesPermissionsTable).values({
					nameRu: permission.nameRu,
					nameUz: permission.nameUz,
					resource: permission.resource,
					action: permission.action,
					permissionGroupId: permissionGroup[0].id,
				});

				continue;
			}

			if (permission.resource.startsWith(REFERENCES_DISTRICTS_CONTROLLER)) {
				const permissionGroup = await db
					.select()
					.from(schemas.referencesPermissionGroupsTable)
					.where(
						eq(
							schemas.referencesPermissionGroupsTable.nameUz,
							"Tumanlar ma'lumotnomalari"
						)
					);

				await db.insert(schemas.referencesPermissionsTable).values({
					nameRu: permission.nameRu,
					nameUz: permission.nameUz,
					resource: permission.resource,
					action: permission.action,
					permissionGroupId: permissionGroup[0].id,
				});

				continue;
			}

			if (
				permission.resource.startsWith(USERS_CONTROLLER) ||
				permission.resource.startsWith(REFERENCES_PERMISSIONS_CONTROLLER) ||
				permission.resource.startsWith(
					REFERENCES_PERMISSION_GROUPS_CONTROLLER
				) ||
				permission.resource.startsWith(REFERENCES_ROLES_CONTROLLER) ||
				permission.resource.startsWith(REFERENCES_ROLES_PERMISSIONS_CONTROLLER) ||
				permission.resource.startsWith(REFERENCES_RESOURCES_CONTROLLER)
			) {
				const permissionGroup = await db
					.select()
					.from(schemas.referencesPermissionGroupsTable)
					.where(
						eq(
							schemas.referencesPermissionGroupsTable.nameUz,
							'Adminga aloqador ruxsatlar'
						)
					);

				await db.insert(schemas.referencesPermissionsTable).values({
					nameRu: permission.nameRu,
					nameUz: permission.nameUz,
					resource: permission.resource,
					action: permission.action,
					permissionGroupId: permissionGroup[0].id,
				});

				continue;
			}

			throw new Error('Permission not found while seeding');
		}

		const allPermissions = await db
			.select()
			.from(schemas.referencesPermissionsTable);

		for (const role of roles) {
			const newRole = await db
				.insert(schemas.referencesRolesTable)
				.values({
					nameRu: role.nameRu,
					nameUz: role.nameUz,
				})
				.returning({ id: schemas.referencesRolesTable.id });

			if (role.nameUz === 'Admin') {
				await db.insert(schemas.referencesRolesPermissionsTable).values(
					allPermissions.map((permission) => ({
						roleId: newRole[0].id,
						permissionId: permission.id,
					}))
				);
			}

			if (role.nameUz === 'Foydalanuvchi') {
				await db.insert(schemas.referencesRolesPermissionsTable).values(
					allPermissions
						.filter((permission) => {
							if (permission.action === ResourceActions.READ) {
								if (
									permission.resource.startsWith(
										REFERENCES_COUNTRIES_CONTROLLER
									) ||
									permission.resource.startsWith(
										REFERENCES_REGIONS_CONTROLLER
									) ||
									permission.resource.startsWith(
										REFERENCES_DISTRICTS_CONTROLLER
									)
								) {
									return true;
								}
							}
							return false;
						})
						.map((permission) => ({
							roleId: newRole[0].id,
							permissionId: permission.id,
						}))
				);
			}
		}

		for (const user of users) {
			const hashedPassword = await bcrypt.hash(user.password, 10);

			const district = await db.query.referencesDistrictsTable.findFirst({
				where: eq(schemas.referencesDistrictsTable.nameUz, user.districtName),
				columns: {
					id: true,
					regionId: true,
				},
				with: {
					region: {
						columns: {
							countryId: true,
						},
					},
				},
			});

			if (!district) {
				throw new Error('District not found while seeding');
			}

			const newUser = await db
				.insert(schemas.usersTable)
				.values({
					username: user.username,
					fullName: user.fullName,
					email: user.email,
					phone: user.phone,
					password: hashedPassword,
					countryId: district.region.countryId,
					regionId: district.regionId,
					districtId: district.id,
				})
				.returning({
					id: schemas.usersTable.id,
					username: schemas.usersTable.username,
					email: schemas.usersTable.email,
				});

			const role = await db.query.referencesRolesTable.findFirst({
				where: eq(schemas.referencesRolesTable.nameUz, user.roleName),
				columns: {
					id: true,
				},
			});

			if (!role) {
				throw new Error('Role not found while seeding');
			}

			await db.insert(schemas.usersRolesTable).values([
				{
					userId: newUser[0].id,
					roleId: role.id,
				},
			]);

			const secret = process.env.JWT_SECRET;

			if (!secret) {
				throw new Error('JWT_SECRET is not set');
			}

			const accessToken = jwt.sign(
				{
					id: newUser[0].id,
					username: newUser[0].username,
					email: newUser[0].email,
				},
				secret,
				{ expiresIn: '1h' }
			);

			await db
				.update(schemas.usersTable)
				.set({ token: accessToken, status: 'active' })
				.where(eq(schemas.usersTable.id, newUser[0].id));
		}

		logger.info('SUCCESSFULLY SEED DATABASE 🌴');
	} catch (error) {
		console.error('error while seeding ❌', error);
	}
}

main();
