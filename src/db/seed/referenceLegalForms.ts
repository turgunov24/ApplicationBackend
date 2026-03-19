import { InferSelectModel } from 'drizzle-orm';
import * as schemas from '../schemas/index';

export const legalForms: Array<
	Pick<
		InferSelectModel<typeof schemas.referencesLegalFormsTable>,
		'name'
	>
> = [
	{ name: 'MChJ (Mas\'uliyati cheklangan jamiyat)' },
	{ name: 'AJ (Aksiyadorlik jamiyati)' },
	{ name: 'YaTT (Yakka tartibdagi tadbirkor)' },
];
