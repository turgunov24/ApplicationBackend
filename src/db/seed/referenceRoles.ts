import { InferSelectModel } from 'drizzle-orm';
import * as schemas from '../schemas/index';
import { roleNamesForSeeding } from './users'

export const roles: Array<
	Pick<
		InferSelectModel<typeof schemas.referencesRolesTable>,
		'nameRu' | 'nameUz'
	>
> = [
	{
		nameUz: roleNamesForSeeding.SUPER_ADMIN,
		nameRu: 'Суперадмин',
	},
	{
		nameUz: roleNamesForSeeding.ADMIN,
		nameRu: 'Админ',
	},
	{
		nameUz: roleNamesForSeeding.USER,
		nameRu: 'Фойдаланувчи',
	},
];
