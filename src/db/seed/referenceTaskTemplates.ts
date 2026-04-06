import { InferSelectModel } from 'drizzle-orm';
import * as schemas from '../schemas/index';

export const taskTemplates: Array<
	Pick<
		InferSelectModel<typeof schemas.referencesTaskTemplatesTable>,
		'translationKey' | 'description' | 'date' | 'dayOfMonth' | 'monthOfQuarter' | 'monthOfYear'
	> & {
		recurrenceToken: string;
		categoryTranslationKey: string;
	}
> = [
	{
		translationKey: 'task_template_monthly_report',
		description: 'Oylik hisobot tayyorlash',
		recurrenceToken: 'monthly',
		categoryTranslationKey: 'task_template_category_financial',
		date: null,
		dayOfMonth: 5,
		monthOfQuarter: null,
		monthOfYear: null,
	},
	{
		translationKey: 'task_template_quarterly_audit',
		description: 'Choraklik audit tekshiruvi',
		recurrenceToken: 'fiscalQuarter',
		categoryTranslationKey: 'task_template_category_operational',
		date: null,
		dayOfMonth: 10,
		monthOfQuarter: 1,
		monthOfYear: null,
	},
];
