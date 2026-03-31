import { InferSelectModel } from 'drizzle-orm';
import * as schemas from '../schemas/index';

export const tasksComments: Array<
	Pick<
		InferSelectModel<typeof schemas.referencesTasksCommentsTable>,
		'text'
	> & {
		taskTranslationKey: string;
	}
> = [
	{
		text: 'Integratsiya uchun hujjatlar tayyorlandi',
		taskTranslationKey: 'task_integration_setup',
	},
	{
		text: 'Hujjatlar tekshirilmoqda',
		taskTranslationKey: 'task_document_review',
	},
];
