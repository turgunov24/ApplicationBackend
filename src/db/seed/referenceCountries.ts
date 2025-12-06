import { InferSelectModel } from 'drizzle-orm';
import * as schemas from '../schemas/index';

export const countries: Array<
	Pick<
		InferSelectModel<typeof schemas.referencesCountriesTable>,
		'nameRu' | 'nameUz'
	> & {
		regions: Array<
			Pick<
				InferSelectModel<typeof schemas.referencesRegionsTable>,
				'nameRu' | 'nameUz'
			> & {
				districts: Array<
					Pick<
						InferSelectModel<typeof schemas.referencesDistrictsTable>,
						'nameRu' | 'nameUz'
					>
				>;
			}
		>;
	}
> = [
	{
		nameUz: 'Uzbekistan',
		nameRu: 'Uzbekistan',
		regions: [
			{
				nameRu: 'Андижон',
				nameUz: 'Andijon',
				districts: [
					{
						nameRu: 'Балиқчи тумани',
						nameUz: 'Baliqchi tumani',
					},
					{
						nameRu: 'Asaka tumani',
						nameUz: 'Асака тумани',
					},
				],
			},
			{
				nameRu: 'Самарқанд',
				nameUz: 'Samarqand',
				districts: [
					{
						nameRu: 'Ургут тумани',
						nameUz: 'Urgut tumani',
					},
					{
						nameRu: 'Нарпай тумани',
						nameUz: 'Narpay tumani',
					},
				],
			},
		],
	},
	{
		nameUz: 'Qozog‘iston',
		nameRu: 'Казахстан',
		regions: [
			{
				nameRu: 'Алмати',
				nameUz: 'Almati',
				districts: [
					{
						nameRu: 'Алмалинский район',
						nameUz: 'Almalinskiy tumani',
					},
					{
						nameRu: 'Ауэзовский район',
						nameUz: 'Auezovskiy tumani',
					},
				],
			},
			{
				nameRu: 'Астана',
				nameUz: 'Astana',
				districts: [
					{
						nameRu: 'Сарыарка район',
						nameUz: 'Saryarka tumani',
					},
					{
						nameRu: 'Есиль район',
						nameUz: 'Yesil tumani',
					},
				],
			},
			{
				nameRu: 'Шымкент',
				nameUz: 'Shymkent',
				districts: [
					{
						nameRu: 'Абайский район',
						nameUz: 'Abayskiy tumani',
					},
					{
						nameRu: 'Енбекшинский район',
						nameUz: 'Enbekshinskiy tumani',
					},
				],
			},
		],
	},
];

