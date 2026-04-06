import { InferSelectModel } from 'drizzle-orm';
import * as schemas from '../schemas/index';

export const taskRecurrences: Array<
	Pick<
		InferSelectModel<typeof schemas.referencesTaskRecurrenceTable>,
		'translationKey' | 'token' | 'description'
	>
> = [
	{
		translationKey: 'task_recurrence_once',
		token: 'once',
		description: 'Bir martalik vazifa',
	},
	{
		translationKey: 'task_recurrence_monthly',
		token: 'monthly',
		description: 'Har oylik vazifa',
	},
	{
		translationKey: 'task_recurrence_fiscal_quarter',
		token: 'fiscalQuarter',
		description: 'Choraklik vazifa',
	},
	{
		translationKey: 'task_recurrence_yearly',
		token: 'yearly',
		description: 'Yillik vazifa',
	},
];
