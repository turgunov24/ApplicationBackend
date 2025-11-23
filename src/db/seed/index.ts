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
	REFERENCES_ROLES_CONTROLLER,
	REFERENCES_ROLES_PERMISSIONS_CONTROLLER,
	USERS_CONTROLLER,
} from '../../helpers/endPoints';
import { eq } from 'drizzle-orm';

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

		for (const role of roles) {
			const newRole = await db
				.insert(schemas.referencesRolesTable)
				.values({
					nameRu: role.nameRu,
					nameUz: role.nameUz,
				})
				.returning({ id: schemas.referencesRolesTable.id });
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
				permission.resource.startsWith(REFERENCES_ROLES_PERMISSIONS_CONTROLLER)
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

		logger.info('SUCCESSFULLY SEED DATABASE 🌴');
	} catch (error) {
		console.error('error while seeding ❌', error);
	}
}

main();
