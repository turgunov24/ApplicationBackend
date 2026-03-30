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
	PRINCIPALS_CONTROLLER,
	PRINCIPAL_CUSTOMERS_CONTROLLER,
	REFERENCES_COUNTERPARTIES_CONTROLLER,
	REFERENCES_LEGAL_FORMS_CONTROLLER,
	REFERENCES_SERVICES_CONTROLLER,
	REFERENCES_PRINCIPAL_CUSTOMER_CREDENTIALS_CONTROLLER,
	ATTACH_TARIFF_TO_PRINCIPAL_CUSTOMERS_CONTROLLER,
	REFERENCES_TRANSLATIONS_CONTROLLER,
	REFERENCES_USER_TRANSLATIONS_CONTROLLER,
	REFERENCES_TASKS_CONTROLLER,
} from '../../helpers/endPoints';
import { eq } from 'drizzle-orm';
import { ResourceActions } from '../../types/auth';
import { roleNamesForSeeding, users } from './users';
import { principals } from './principals';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { clientTypes } from './referenceClientTypes';
import { counterparties } from './referenceCounterparties';
import { legalForms } from './referenceLegalForms';
import { services } from './referenceServices';
import { currencies } from './referenceCurrencies';
import { tariffs } from './referenceTariffs';
import { principalCustomers } from './principalCustomers';
import { translations } from './referenceTranslations';
import { userTranslations } from './referenceUserTranslations';
import { tasks } from './referenceTasks';

// Controller → Permission group name mapping
const controllerToGroupMap: Record<string, string> = {
	[REFERENCES_COUNTRIES_CONTROLLER]: "Mamlakatlar ma'lumotnomalari",
	[REFERENCES_REGIONS_CONTROLLER]: "Viloyatlar ma'lumotnomalari",
	[REFERENCES_DISTRICTS_CONTROLLER]: "Tumanlar ma'lumotnomalari",
	[REFERENCES_CURRENCIES_CONTROLLER]: "Valyutalar ma'lumotnomalari",
	[REFERENCES_CLIENT_TYPES_CONTROLLER]: "Mijoz turlari ma'lumotnomalari",
	[REFERENCES_TARIFFS_CONTROLLER]: "Tariflar ma'lumotnomalari",
	[REFERENCES_COUNTERPARTIES_CONTROLLER]: "Kontragentlar ma'lumotnomalari",
	[REFERENCES_LEGAL_FORMS_CONTROLLER]:
		"Tashkiliy-huquqiy shakllar ma'lumotnomalari",
	[REFERENCES_SERVICES_CONTROLLER]: "Xizmatlar ma'lumotnomalari",
	[REFERENCES_PRINCIPAL_CUSTOMER_CREDENTIALS_CONTROLLER]:
		"Principal mijozlar ma'lumotlari",
	[ATTACH_TARIFF_TO_PRINCIPAL_CUSTOMERS_CONTROLLER]: 'Tariflarni biriktirish',
	[REFERENCES_TRANSLATIONS_CONTROLLER]: "Tarjimalar ma'lumotnomalari",
	[REFERENCES_USER_TRANSLATIONS_CONTROLLER]:
		"Foydalanuvchi tarjimalari ma'lumotnomalari",
	[REFERENCES_TASKS_CONTROLLER]: "Vazifalar ma'lumotnomalari",
};

// Admin-related controllers — barchasi bitta gruppa
const adminControllers = [
	USERS_CONTROLLER,
	PRINCIPALS_CONTROLLER,
	REFERENCES_PERMISSIONS_CONTROLLER,
	REFERENCES_PERMISSION_GROUPS_CONTROLLER,
	REFERENCES_ROLES_CONTROLLER,
	REFERENCES_ROLES_PERMISSIONS_CONTROLLER,
	REFERENCES_RESOURCES_CONTROLLER,
	PRINCIPAL_CUSTOMERS_CONTROLLER,
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
				createdBy: 2,
			})
			.returning({ id: schemas.referencesCountriesTable.id });

		for (const region of country.regions) {
			const newRegion = await db
				.insert(schemas.referencesRegionsTable)
				.values({
					nameRu: region.nameRu,
					nameUz: region.nameUz,
					countryId: newCountry[0].id,
					createdBy: 2,
				})
				.returning({ id: schemas.referencesRegionsTable.id });

			for (const district of region.districts) {
				await db.insert(schemas.referencesDistrictsTable).values({
					regionId: newRegion[0].id,
					nameRu: district.nameRu,
					nameUz: district.nameUz,
					createdBy: 2,
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
				createdBy: 2,
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
			createdBy: 2,
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
				createdBy: 2,
			})
			.returning({ id: schemas.referencesRolesTable.id });

		if (
			[roleNamesForSeeding.ADMIN, roleNamesForSeeding.SUPER_ADMIN].includes(
				role.nameUz,
			)
		) {
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
 * Foydalanuvchilarni yaratadi (dastlabki bosqich - locationlarsiz)
 */
async function seedUsersInitial() {
	for (const user of users) {
		const hashedPassword = await bcrypt.hash(user.password, 10);

		// Dastlabki yaratishda location_id larni 0 qilib turamiz
		await db.insert(schemas.usersTable).values({
			id: user.id,
			createdBy: user.createdBy,
			username: user.username,
			fullName: user.fullName,
			email: user.email,
			phone: user.phone,
			password: hashedPassword,
			countryId: 0,
			regionId: 0,
			districtId: 0,
		});
		// .onConflictDoNothing(); // Agar user allaqachon bor bo'lsa, hech narsa qilmaymiz
	}
}

/**
 * Foydalanuvchilarni update qiladi (locationlar va rollarni qo'shadi)
 */
async function seedUsersUpdate() {
	for (const user of users) {
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
			throw new Error(`District not found for user ${user.username}`);
		}

		const role = await db.query.referencesRolesTable.findFirst({
			where: eq(schemas.referencesRolesTable.nameUz, user.roleName),
			columns: {
				id: true,
			},
		});

		if (!role) {
			throw new Error(`Role not found for user ${user.username}`);
		}

		const secret = process.env.JWT_SECRET;
		if (!secret) {
			throw new Error('JWT_SECRET is not set');
		}

		const accessToken = jwt.sign(
			{
				id: user.id,
				username: user.username,
				email: user.email,
			},
			secret,
			{ expiresIn: '1h' },
		);

		// Userni update qilamiz
		await db
			.update(schemas.usersTable)
			.set({
				countryId: district.region.countryId,
				regionId: district.regionId,
				districtId: district.id,
				token: accessToken,
				status: 'active',
			})
			.where(eq(schemas.usersTable.id, user.id));

		// Role ni biriktiramiz
		await db.insert(schemas.usersRolesTable).values({
			userId: user.id,
			roleId: role.id,
		});
		// .onConflictDoNothing();
	}
}

/**
 * Principallarni seed qiladi
 */
async function seedPrincipals() {
	for (const principal of principals) {
		const district = await db.query.referencesDistrictsTable.findFirst({
			where: eq(
				schemas.referencesDistrictsTable.nameUz,
				principal.districtName,
			),
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
			throw new Error(`District not found for principal ${principal.username}`);
		}

		const hashedPassword = await bcrypt.hash(principal.password, 10);

		await db.insert(schemas.principalsTable).values({
			username: principal.username,
			fullName: principal.fullName,
			email: principal.email,
			phone: principal.phone,
			password: hashedPassword,
			createdBy: principal.createdBy,
			countryId: district.region.countryId,
			regionId: district.regionId,
			districtId: district.id,
			status: 'active',
		});
		// .onConflictDoNothing();
	}
}

/**
 * Client turlarini seed qiladi
 */
async function seedClientTypes() {
	for (const clientType of clientTypes) {
		await db.insert(schemas.referencesClientTypesTable).values({
			nameUz: clientType.nameUz,
			nameRu: clientType.nameRu,
			createdBy: 2,
		});
		// .onConflictDoNothing();
	}
	logger.info('Client types seeded ✅');
}

/**
 * Counterparties ni seed qiladi
 */
async function seedCounterparties() {
	for (const counterparty of counterparties) {
		const principal = await db.query.principalsTable.findFirst({
			where: eq(
				schemas.principalsTable.username,
				counterparty.principalUsername,
			),
			columns: { id: true },
		});

		if (!principal) {
			throw new Error(
				`Principal not found for counterparty ${counterparty.name}`,
			);
		}

		await db.insert(schemas.referencesCounterpartiesTable).values({
			name: counterparty.name,
			phone: counterparty.phone,
			principalId: principal.id,
			createdBy: 2,
		});
	}
	logger.info('Counterparties seeded ✅');
}

/**
 * Legal forms ni seed qiladi
 */
async function seedLegalForms() {
	for (const legalForm of legalForms) {
		await db.insert(schemas.referencesLegalFormsTable).values({
			name: legalForm.name,
			createdBy: 2,
		});
	}
	logger.info('Legal forms seeded ✅');
}

/**
 * Services ni seed qiladi
 */
async function seedServices() {
	for (const service of services) {
		await db.insert(schemas.referencesServicesTable).values({
			name: service.name,
			createdBy: 2,
		});
	}
	logger.info('Services seeded ✅');
}

/**
 * Currencies ni seed qiladi
 */
async function seedCurrencies() {
	for (const currency of currencies) {
		await db.insert(schemas.referencesCurrenciesTable).values({
			nameUz: currency.nameUz,
			nameRu: currency.nameRu,
			createdBy: 2,
		});
	}
	logger.info('Currencies seeded ✅');
}

/**
 * Tariffs ni seed qiladi
 */
async function seedTariffs() {
	const dbCurrencies = await db
		.select({
			id: schemas.referencesCurrenciesTable.id,
			nameUz: schemas.referencesCurrenciesTable.nameUz,
		})
		.from(schemas.referencesCurrenciesTable);

	for (const tariff of tariffs) {
		const currency = dbCurrencies.find(
			(c) => c.nameUz === tariff.currencyNameUz,
		);
		if (!currency) {
			logger.warn(`Currency ${tariff.currencyNameUz} not found!`);
			continue;
		}

		await db.insert(schemas.referencesTariffsTable).values({
			nameUz: tariff.nameUz,
			nameRu: tariff.nameRu,
			monthlyPrice: tariff.monthlyPrice,
			currencyId: currency.id,
			createdBy: 2,
		});
	}
	logger.info('Tariffs seeded ✅');
}

/**
 * Principal customerlarni seed qiladi
 */
async function seedPrincipalCustomersInitial() {
	for (const pc of principalCustomers) {
		const principal = await db.query.principalsTable.findFirst({
			where: eq(schemas.principalsTable.username, pc.principalUsername),
			columns: { id: true },
		});

		if (!principal) {
			throw new Error(`Principal not found for customer ${pc.name}`);
		}

		const clientType = await db.query.referencesClientTypesTable.findFirst({
			where: eq(schemas.referencesClientTypesTable.nameUz, pc.clientTypeNameUz),
			columns: { id: true },
		});

		if (!clientType) {
			throw new Error(`Client type not found for customer ${pc.name}`);
		}

		const counterparty = await db.query.referencesCounterpartiesTable.findFirst(
			{
				where: eq(
					schemas.referencesCounterpartiesTable.name,
					pc.counterpartyName,
				),
				columns: { id: true },
			},
		);

		if (!counterparty) {
			throw new Error(`Counterparty not found for customer ${pc.name}`);
		}

		const legalForm = await db.query.referencesLegalFormsTable.findFirst({
			where: eq(schemas.referencesLegalFormsTable.name, pc.legalFormName),
			columns: { id: true },
		});

		if (!legalForm) {
			throw new Error(`Legal form not found for customer ${pc.name}`);
		}

		await db.insert(schemas.principalCustomersTable).values({
			name: pc.name,
			principalId: principal.id,
			clientTypeId: clientType.id,
			counterpartyId: counterparty.id,
			legalFormId: legalForm.id,
			inn: pc.inn,
			createdBy: pc.createdBy,
			status: pc.status,
		});
	}
	logger.info('Principal customers initial seeded ✅');
}

/**
 * Principal customerlarga tegishli credentiallar va tariflarni biriktiradi
 */
async function seedPrincipalCustomersUpdate() {
	const services = await db
		.select({ id: schemas.referencesServicesTable.id })
		.from(schemas.referencesServicesTable);

	const tariffs = await db
		.select({ id: schemas.referencesTariffsTable.id })
		.from(schemas.referencesTariffsTable);

	for (const pc of principalCustomers) {
		const customer = await db.query.principalCustomersTable.findFirst({
			where: eq(schemas.principalCustomersTable.name, pc.name),
			columns: { id: true },
		});

		if (!customer) {
			throw new Error(`Principal customer not found: ${pc.name}`);
		}

		const customerId = customer.id;

		if (services.length > 0) {
			await db
				.insert(schemas.referencesPrincipalCustomerCredentialsTable)
				.values({
					serviceId: services[0].id,
					username: `user_${customerId}`,
					password: `pass_${customerId}`,
					additionalInformationUz: "Qo'shimcha ma'lumot",
					additionalInformationRu: 'Дополнительная информация',
					principalCustomerId: customerId,
					createdBy: 2,
				});
		}

		if (tariffs.length > 0) {
			const startDate = new Date();
			const endDate = new Date();
			endDate.setMonth(endDate.getMonth() + 1);

			await db
				.insert(schemas.referencesAttachTariffToPrincipalCustomersTable)
				.values({
					principalCustomerId: customerId,
					tariffId: tariffs[0].id,
					startDate: startDate,
					endDate: endDate,
					createdBy: 2,
				});
		}
	}
	logger.info('Principal customers update seeded ✅');
}

/**
 * Translationlarni seed qiladi
 */
async function seedTranslations() {
	for (const translation of translations) {
		await db.insert(schemas.referencesTranslationsTable).values({
			lang: translation.lang,
			namespace: translation.namespace,
			key: translation.key,
			value: translation.value,
			createdBy: 2,
		});
	}
	logger.info('Translations seeded ✅');
}

/**
 * User translationlarni seed qiladi
 */
async function seedUserTranslations() {
	for (const ut of userTranslations) {
		const user = await db.query.usersTable.findFirst({
			where: eq(schemas.usersTable.username, ut.userUsername),
			columns: { id: true },
		});

		if (!user) {
			throw new Error(`User not found for user translation: ${ut.userUsername}`);
		}

		await db.insert(schemas.referencesUserTranslationsTable).values({
			userId: user.id,
			lang: ut.lang,
			namespace: ut.namespace,
			key: ut.key,
			value: ut.value,
			createdBy: 2,
		});
	}
	logger.info('User translations seeded ✅');
}

/**
 * Vazifalarni seed qiladi
 */
async function seedTasks() {
	for (const task of tasks) {
		const customer = await db.query.principalCustomersTable.findFirst({
			where: eq(schemas.principalCustomersTable.name, task.principalCustomerName),
			columns: { id: true },
		});

		if (!customer) {
			throw new Error(`Principal customer not found: ${task.principalCustomerName}`);
		}

		await db.insert(schemas.referencesTasksTable).values({
			translationKey: task.translationKey,
			description: task.description,
			deadline: task.deadline,
			principalCustomerId: customer.id,
			createdBy: 2,
		});
	}
	logger.info('Tasks seeded ✅');
}

/**
 * Asosiy seed funksiya — barcha bosqichlarni ketma-ket ishga tushiradi
 */
async function main() {
	try {
		logger.info('RESET DATABASE ♻️');
		await reset(db, schemas);
		logger.info('SUCCESSFULLY RESET DATABASE ✅');

		// 1. Dastlabki userlarni yaratish (locationsiz)
		await seedUsersInitial();

		// 2. Referencelarni yaratish (endi user create qilingan bo'ladi)
		await seedCountries();
		await seedPermissionGroups();
		await seedPermissions();
		await seedRoles();

		await seedUsersUpdate();
		await seedPrincipals();
		await seedClientTypes();
		await seedCounterparties();
		await seedLegalForms();
		await seedServices();
		await seedCurrencies();
		await seedTariffs();
		await seedPrincipalCustomersInitial();
		await seedPrincipalCustomersUpdate();
		await seedTranslations();
		await seedUserTranslations();
		await seedTasks();

		logger.info('SUCCESSFULLY SEED DATABASE 🌴');
	} catch (error) {
		console.error('error while seeding ❌', error);
	}
}

main();
