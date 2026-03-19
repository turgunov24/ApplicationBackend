import { InferSelectModel } from 'drizzle-orm';
import * as schemas from '../schemas/index';

export const services: Array<
	Pick<
		InferSelectModel<typeof schemas.referencesServicesTable>,
		'name'
	>
> = [
	{ name: 'Xalqaro tovar va transport yuk xatlarni qayd etish xizmati' },
	{ name: 'Bojxona xizmati' },
	{ name: 'Agro xizmati' },
];
