export const tasks: Array<{
	translationKey: string;
	description: string;
	principalCustomerName: string;
	deadline?: Date;
}> = [
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
