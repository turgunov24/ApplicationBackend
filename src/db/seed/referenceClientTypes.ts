import { InferSelectModel } from 'drizzle-orm';
import * as schemas from '../schemas/index';

export const clientTypes: Array<
	Pick<
		InferSelectModel<typeof schemas.referencesClientTypesTable>,
		'nameUz' | 'nameRu'
	>
> = [
	{ nameUz: 'Jismoniy shaxs', nameRu: 'Физическое лицо' },
	{ nameUz: 'Yuridik shaxs', nameRu: 'Юридическое лицо' },
];
