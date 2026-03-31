import { InferSelectModel } from 'drizzle-orm';
import * as schemas from '../schemas/index';

export const taskActionsHistory: Array<
	Pick<
		InferSelectModel<typeof schemas.referencesTaskActionsHistoryTable>,
		'type' | 'status'
	> & {
		taskTranslationKey: string;
	}
> = [
	{
		type: 'changeStatus',
		status: 'active',
		taskTranslationKey: 'task_integration_setup',
	},
	{
		type: 'changeStatus',
		status: 'pending',
		taskTranslationKey: 'task_document_review',
	},
];
