import { InferSelectModel } from 'drizzle-orm';
import * as schemas from '../schemas/index';

export const userTranslations: Array<
	Pick<
		InferSelectModel<typeof schemas.referencesUserTranslationsTable>,
		'lang' | 'namespace' | 'key' | 'value'
	> & { userUsername: string }
> = [
	// User-specific overrides for user "admin" — Uzbek
	{
		userUsername: 'admin1',
		lang: 'uz',
		namespace: 'navbar',
		key: 'app',
		value: 'Dastur',
	},
	{
		userUsername: 'admin1',
		lang: 'uz',
		namespace: 'navbar',
		key: 'user',
		value: 'Foydalanuvchilar',
	},
	{
		userUsername: 'admin1',
		lang: 'uz',
		namespace: 'navbar',
		key: 'subheader',
		value: "Qo'shimcha bo'lim",
	},

	// User-specific overrides for user "admin" — Russian
	{
		userUsername: 'admin1',
		lang: 'ru',
		namespace: 'navbar',
		key: 'app',
		value: 'Программа',
	},
	{
		userUsername: 'admin1',
		lang: 'ru',
		namespace: 'navbar',
		key: 'user',
		value: 'Пользователи',
	},
];
