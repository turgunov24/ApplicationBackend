import { InferSelectModel } from 'drizzle-orm';
import * as schemas from '../schemas/index';

export const tasks: Array<
	Pick<
		InferSelectModel<typeof schemas.referencesTasksTable>,
		'translationKey' | 'description' | 'deadline'
	> & {
		principalCustomerName: string;
	}
> = [
	{
		translationKey: 'task_integration_setup',
		description: 'Integratsiya sozlamalari',
		principalCustomerName: 'Aliyev Trading',
		deadline: new Date('2026-04-15'),
	},
	{
		translationKey: 'task_document_review',
		description: 'Hujjatlarni tekshirish',
		principalCustomerName: 'Global Textile LLC',
		deadline: new Date('2026-04-30'),
	},
];
