import { InferSelectModel } from 'drizzle-orm';
import * as schemas from '../schemas/index';

export const counterparties: Array<
	Pick<
		InferSelectModel<typeof schemas.referencesCounterpartiesTable>,
		'name' | 'phone'
	> & { principalUsername: string }
> = [
	{ name: 'Contoso Ltd.', phone: '+998901234567', principalUsername: 'principal1' },
	{ name: 'Acme Corp.', phone: '+998907654321', principalUsername: 'principal2' },
];
