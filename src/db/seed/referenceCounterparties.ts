import { InferSelectModel } from 'drizzle-orm';
import * as schemas from '../schemas/index';

export const counterparties: Array<
	Pick<
		InferSelectModel<typeof schemas.referencesCounterpartiesTable>,
		'name'
	>
> = [
	{ name: 'Contoso Ltd.' },
	{ name: 'Acme Corp.' },
];
