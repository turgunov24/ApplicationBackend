import 'dotenv/config';
import { reset } from 'drizzle-seed';
import * as schemas from '../schemas/index';
import 'dotenv/config';
import db from '../index';
import { logger } from '../../utils/logger';
import { countries } from './referenceCountries';
import { roles } from './referenceRoles';
import { permissionGroups } from './referencePermissionGroup'

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
			const newRole = await db
				.insert(schemas.referencesPermissionGroupsTable)
				.values({
					nameRu: permissionGroup.nameRu,
					nameUz: permissionGroup.nameUz,
				})
				.returning({ id: schemas.referencesPermissionGroupsTable.id });
		}

		logger.info('SUCCESSFULLY SEED DATABASE 🌴');
	} catch (error) {
		console.error('error while seeding ❌', error);
	}
}

main();
