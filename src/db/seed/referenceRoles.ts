import { InferSelectModel } from 'drizzle-orm';
import * as schemas from '../schemas/index';

export const roles: Array<
	Pick<
		InferSelectModel<typeof schemas.referencesRolesTable>,
		'nameRu' | 'nameUz'
	>
> = [
	{
		nameUz: 'Admin',
		nameRu: 'Админ',
	},
	{
		nameUz: 'Foydalanuvchi',
		nameRu: 'Фойдаланувчи',
	},
];
