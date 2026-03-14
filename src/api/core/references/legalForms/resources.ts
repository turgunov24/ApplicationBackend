import { REFERENCES_LEGAL_FORMS_CONTROLLER } from '../../../../helpers/endPoints';
import { Resource, ResourceActions } from '../../../../types/auth';

const resources: Resource[] = [
	{
		name: 'legalForms-crud',
		endpoint: REFERENCES_LEGAL_FORMS_CONTROLLER,
		allowedActions: [
			ResourceActions.CREATE,
			ResourceActions.UPDATE,
			ResourceActions.READ,
			ResourceActions.DELETE,
		],
	},
	{
		name: 'legalForms-list',
		endpoint: REFERENCES_LEGAL_FORMS_CONTROLLER.concat('/list'),
		allowedActions: [ResourceActions.READ],
	},
	{
		name: 'legalForms-counts-by-status',
		endpoint: REFERENCES_LEGAL_FORMS_CONTROLLER.concat('/counts-by-status'),
		allowedActions: [ResourceActions.READ],
	},
];

export default resources;
