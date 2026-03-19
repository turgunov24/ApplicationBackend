import { InferSelectModel } from 'drizzle-orm';
import * as schemas from '../schemas/index';

export const currencies: Array<
	Pick<
		InferSelectModel<typeof schemas.referencesCurrenciesTable>,
		'nameUz' | 'nameRu'
	>
> = [
	{ nameUz: 'So\'m', nameRu: 'Сум' },
	{ nameUz: 'AQSH dollari', nameRu: 'Доллар США' },
	{ nameUz: 'Yevro', nameRu: 'Евро' },
];
