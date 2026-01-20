import { InferSelectModel } from 'drizzle-orm';
import * as schemas from '../schemas/index';

// IMPORTANT !
// nameUz va nameRu lar seedlarda ishlatilgan shuning uchun modify qilishdan oldin tekshiring

export const permissionGroups: Array<
	Pick<
		InferSelectModel<typeof schemas.referencesPermissionGroupsTable>,
		'nameRu' | 'nameUz'
	>
> = [
	{
		nameUz: "Mamlakatlar ma'lumotnomalari",
		nameRu: 'Мамлакатлар маълумотномалари',
	},
	{
		nameUz: "Viloyatlar ma'lumotnomalari",
		nameRu: 'Вилоятлар маълумотномалари',
	},
	{
		nameUz: "Tumanlar ma'lumotnomalari",
		nameRu: 'Туманлар маълумотномалари',
	},
	{
		nameUz: 'Adminga aloqador ruxsatlar',
		nameRu: 'Админга алоқадор рухсатлар',
	},
	{
		nameUz: "Valyutalar ma'lumotnomalari",
		nameRu: 'Валюталар маълумотномалари',
	},
	{
		nameUz: "Mijoz turlari ma'lumotnomalari",
		nameRu: 'Мижоз турлари маълумотномалари',
	},
	{
		nameUz: "Tariflar ma'lumotnomalari",
		nameRu: 'Тарифлар маълумотномалари',
	},
];
