import { InferSelectModel } from 'drizzle-orm';
import * as schemas from '../schemas/index';

export const tariffs: Array<
	Pick<
		InferSelectModel<typeof schemas.referencesTariffsTable>,
		'nameUz' | 'nameRu' | 'monthlyPrice'
	> & {
		currencyNameUz: string;
	}
> = [
	{ nameUz: 'Asosiy (Oyiga 100,000 UZS)', nameRu: 'Базовый (100,000 UZS/мес)', monthlyPrice: 100000, currencyNameUz: 'So\'m' },
	{ nameUz: 'Premium (Oyiga 500,000 UZS)', nameRu: 'Премиум (500,000 UZS/мес)', monthlyPrice: 500000, currencyNameUz: 'So\'m' },
];
