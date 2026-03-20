import { InferSelectModel } from 'drizzle-orm';
import * as schemas from '../schemas/index';

export const counterparties: Array<
	Pick<
		InferSelectModel<typeof schemas.referencesCounterpartiesTable>,
		'name' | 'phone'
	>
> = [
	{ name: 'Contoso Ltd.', phone: '+998901234567' },
	{ name: 'Acme Corp.', phone: '+998907654321' },
];
