import { REFERENCES_TRANSLATIONS_CONTROLLER } from '../../../../helpers/endPoints';
import { Resource, ResourceActions } from '../../../../types/auth';

const resources: Resource[] = [
	{
		name: 'translations-crud',
		endpoint: REFERENCES_TRANSLATIONS_CONTROLLER,
		allowedActions: [
			ResourceActions.CREATE,
			ResourceActions.UPDATE,
			ResourceActions.READ,
			ResourceActions.DELETE,
		],
	},
	{
		name: 'translations-list',
		endpoint: REFERENCES_TRANSLATIONS_CONTROLLER.concat('/list'),
		allowedActions: [ResourceActions.READ],
	},
	{
		name: 'translations-counts-by-status',
		endpoint: REFERENCES_TRANSLATIONS_CONTROLLER.concat('/counts-by-status'),
		allowedActions: [ResourceActions.READ],
	},
	{
		name: 'translations-bundle',
		endpoint: REFERENCES_TRANSLATIONS_CONTROLLER.concat('/bundle'),
		allowedActions: [ResourceActions.READ],
	},
];

export default resources;
