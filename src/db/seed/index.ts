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
	REFERENCES_CLIENT_TYPES_CONTROLLER,
	REFERENCES_COUNTRIES_CONTROLLER,
	REFERENCES_CURRENCIES_CONTROLLER,
	REFERENCES_DISTRICTS_CONTROLLER,
	REFERENCES_PERMISSION_GROUPS_CONTROLLER,
	REFERENCES_PERMISSIONS_CONTROLLER,
	REFERENCES_REGIONS_CONTROLLER,
	REFERENCES_RESOURCES_CONTROLLER,
	REFERENCES_ROLES_CONTROLLER,
	REFERENCES_ROLES_PERMISSIONS_CONTROLLER,
	REFERENCES_TARIFFS_CONTROLLER,
	USERS_CONTROLLER,
} from '../../helpers/endPoints';
import { eq } from 'drizzle-orm';
import { ResourceActions } from '../../types/auth';
import { roleNamesForSeeding, users } from './users';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Controller → Permission group name mapping
const controllerToGroupMap: Record<string, string> = {
	[REFERENCES_COUNTRIES_CONTROLLER]: "Mamlakatlar ma'lumotnomalari",
	[REFERENCES_REGIONS_CONTROLLER]: "Viloyatlar ma'lumotnomalari",
	[REFERENCES_DISTRICTS_CONTROLLER]: "Tumanlar ma'lumotnomalari",
	[REFERENCES_CURRENCIES_CONTROLLER]: "Valyutalar ma'lumotnomalari",
	[REFERENCES_CLIENT_TYPES_CONTROLLER]: "Mijoz turlari ma'lumotnomalari",
	[REFERENCES_TARIFFS_CONTROLLER]: "Tariflar ma'lumotnomalari",
};

// Admin-related controllers — barchasi bitta gruppa
const adminControllers = [
	USERS_CONTROLLER,
	REFERENCES_PERMISSIONS_CONTROLLER,
	REFERENCES_PERMISSION_GROUPS_CONTROLLER,
	REFERENCES_ROLES_CONTROLLER,
	REFERENCES_ROLES_PERMISSIONS_CONTROLLER,
	REFERENCES_RESOURCES_CONTROLLER,
];

/**
 * Permission uchun tegishli permission group nomini topadi
 */
function findGroupName(resource: string): string {
	for (const [controller, groupName] of Object.entries(controllerToGroupMap)) {
		if (resource.startsWith(controller)) {
			return groupName;
		}
	}

	for (const controller of adminControllers) {
		if (resource.startsWith(controller)) {
			return 'Adminga aloqador ruxsatlar';
		}
	}

	throw new Error(`Permission group not found for resource: ${resource}`);
}

/**
 * Mamlakatlar, viloyatlar va tumanlarni seed qiladi
 */
async function seedCountries() {
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
}

/**
 * Permission gruppalarini seed qiladi
 */
async function seedPermissionGroups() {
	for (const permissionGroup of permissionGroups) {
		await db
			.insert(schemas.referencesPermissionGroupsTable)
			.values({
				nameRu: permissionGroup.nameRu,
				nameUz: permissionGroup.nameUz,
			})
			.returning({ id: schemas.referencesPermissionGroupsTable.id });
	}
}

/**
 * Permissionlarni tegishli gruppalarga bog'lab seed qiladi
 */
async function seedPermissions() {
	for (const permission of permissions) {
		const groupName = findGroupName(permission.resource);

		const permissionGroup = await db
			.select()
			.from(schemas.referencesPermissionGroupsTable)
			.where(eq(schemas.referencesPermissionGroupsTable.nameUz, groupName));

		await db.insert(schemas.referencesPermissionsTable).values({
			nameRu: permission.nameRu,
			nameUz: permission.nameUz,
			resource: permission.resource,
			action: permission.action,
			permissionGroupId: permissionGroup[0].id,
		});
	}
}

/**
 * Rollarni va ularga tegishli permissionlarni seed qiladi
 */
async function seedRoles() {
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

		if ([roleNamesForSeeding.ADMIN, roleNamesForSeeding.SUPER_ADMIN].includes(role.nameUz)) {
			await db.insert(schemas.referencesRolesPermissionsTable).values(
				allPermissions.map((permission) => ({
					roleId: newRole[0].id,
					permissionId: permission.id,
				})),
			);
		}

		if (role.nameUz === roleNamesForSeeding.USER) {
			await db.insert(schemas.referencesRolesPermissionsTable).values(
				allPermissions
					.filter((permission) => {
						if (permission.action === ResourceActions.READ) {
							if (
								permission.resource.startsWith(
									REFERENCES_COUNTRIES_CONTROLLER,
								) ||
								permission.resource.startsWith(REFERENCES_REGIONS_CONTROLLER) ||
								permission.resource.startsWith(REFERENCES_DISTRICTS_CONTROLLER)
							) {
								return true;
							}
						}
						return false;
					})
					.map((permission) => ({
						roleId: newRole[0].id,
						permissionId: permission.id,
					})),
			);
		}
	}
}

/**
 * Foydalanuvchilarni yaratadi, parolini hash qiladi va JWT token generatsiya qiladi
 */
async function seedUsers() {
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
				id: user.id,
				createdBy: user.createdBy,
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
			{ expiresIn: '1h' },
		);

		await db
			.update(schemas.usersTable)
			.set({ token: accessToken, status: 'active' })
			.where(eq(schemas.usersTable.id, newUser[0].id));
	}
}

/**
 * Asosiy seed funksiya — barcha bosqichlarni ketma-ket ishga tushiradi
 */
async function main() {
	try {
		logger.info('RESET DATABASE ♻️');
		await reset(db, schemas);
		logger.info('SUCCESSFULLY RESET DATABASE ✅');

		await seedCountries();
		await seedPermissionGroups();
		await seedPermissions();
		await seedRoles();
		await seedUsers();

		logger.info('SUCCESSFULLY SEED DATABASE 🌴');
	} catch (error) {
		console.error('error while seeding ❌', error);
	}
}

main();
