import { InferSelectModel } from 'drizzle-orm';
import * as schemas from '../schemas/index';

export const taskTemplateCategories: Array<
	Pick<
		InferSelectModel<typeof schemas.referencesTaskTemplateCategoriesTable>,
		'translationKey'
	>
> = [
	{
		translationKey: 'task_template_category_financial',
	},
	{
		translationKey: 'task_template_category_operational',
	},
];
