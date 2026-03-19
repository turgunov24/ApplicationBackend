import { InferSelectModel } from 'drizzle-orm';
import * as schemas from '../schemas/index';

export const principalCustomers: Array<
	Pick<
		InferSelectModel<typeof schemas.principalCustomersTable>,
		'name' | 'createdBy' | 'status'
	> & {
		principalUsername: string;
		clientTypeNameUz: string;
		counterpartyName: string;
		legalFormName: string;
	}
> = [
	{
		name: 'Aliyev Trading',
		principalUsername: 'principal1',
		clientTypeNameUz: 'Jismoniy shaxs',
		counterpartyName: 'Contoso Ltd.',
		legalFormName: 'MChJ (Mas\'uliyati cheklangan jamiyat)',
		createdBy: 2,
		status: 'active',
	},
	{
		name: 'Global Textile LLC',
		principalUsername: 'principal2',
		clientTypeNameUz: 'Yuridik shaxs',
		counterpartyName: 'Acme Corp.',
		legalFormName: 'AJ (Aksiyadorlik jamiyati)',
		createdBy: 2,
		status: 'active',
	},
];
