import { InferSelectModel } from 'drizzle-orm';
import * as schemas from '../schemas/index';

export const taskTemplates: Array<
	Pick<
		InferSelectModel<typeof schemas.referencesTaskTemplatesTable>,
		'translationKey' | 'description' | 'recurrence' | 'date' | 'dayOfMonth' | 'monthOfQuarter' | 'monthOfYear'
	>
> = [
	{
		translationKey: 'task_template_monthly_report',
		description: 'Oylik hisobot tayyorlash',
		recurrence: 'monthly',
		date: null,
		dayOfMonth: 5,
		monthOfQuarter: null,
		monthOfYear: null,
	},
	{
		translationKey: 'task_template_quarterly_audit',
		description: 'Choraklik audit tekshiruvi',
		recurrence: 'fiscalQuarter',
		date: null,
		dayOfMonth: 10,
		monthOfQuarter: 1,
		monthOfYear: null,
	},
];
