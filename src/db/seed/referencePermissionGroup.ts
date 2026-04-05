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
	{
		nameUz: "Kontragentlar ma'lumotnomalari",
		nameRu: 'Контрагентлар маълумотномалари',
	},
	{
		nameUz: "Tashkiliy-huquqiy shakllar ma'lumotnomalari",
		nameRu: 'Ташкилий-ҳуқуқий шакллар маълумотномалари',
	},
	{
		nameUz: "Xizmatlar ma'lumotnomalari",
		nameRu: 'Хизматлар маълумотномалари',
	},
	{
		nameUz: "Principal mijozlar ma'lumotlari",
		nameRu: 'Принсипал мижозлар маълумотлари',
	},
	{
		nameUz: "Tariflarni biriktirish",
		nameRu: 'Тарифларни бириктириш',
	},
	{
		nameUz: "Tarjimalar ma'lumotnomalari",
		nameRu: 'Таржималар маълумотномалари',
	},
	{
		nameUz: "Foydalanuvchi tarjimalari ma'lumotnomalari",
		nameRu: 'Фойдаланувчи таржималари маълумотномалари',
	},
	{
		nameUz: "Vazifalar ma'lumotnomalari",
		nameRu: 'Вазифалар маълумотномалари',
	},
	{
		nameUz: "Vazifa izohlari ma'lumotnomalari",
		nameRu: 'Вазифа изоҳлари маълумотномалари',
	},
	{
		nameUz: "Vazifa harakatlari tarixi ma'lumotnomalari",
		nameRu: 'Вазифа ҳаракатлари тарихи маълумотномалари',
	},
	{
		nameUz: "Vazifa shablonlari ma'lumotnomalari",
		nameRu: 'Вазифа шаблонлари маълумотномалари',
	},
];
