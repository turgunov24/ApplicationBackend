import { InferSelectModel } from 'drizzle-orm';
import * as schemas from '../schemas/index';

export const permissionGroups: Array<
	Pick<
		InferSelectModel<typeof schemas.referencesPermissionGroupsTable>,
		'nameRu' | 'nameUz'
	>
> = [
	{
		nameUz: "Ma'lumotnomalar bilan ishlash",
		nameRu: 'Маълумотномалар билан ишлаш',
	},
	{
		nameUz: "Ma'lumotnomalarni ko'rish",
		nameRu: 'Маълумотномаларни кўриш',
	},
];
