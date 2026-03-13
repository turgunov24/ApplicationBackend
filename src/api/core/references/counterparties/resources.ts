import { REFERENCES_COUNTERPARTIES_CONTROLLER } from '../../../../helpers/endPoints';
import { Resource, ResourceActions } from '../../../../types/auth';

const resources: Resource[] = [
	{
		name: 'counterparties-crud',
		endpoint: REFERENCES_COUNTERPARTIES_CONTROLLER,
		allowedActions: [
			ResourceActions.CREATE,
			ResourceActions.UPDATE,
			ResourceActions.READ,
			ResourceActions.DELETE,
		],
	},
	{
		name: 'counterparties-list',
		endpoint: REFERENCES_COUNTERPARTIES_CONTROLLER.concat('/list'),
		allowedActions: [ResourceActions.READ],
	},
	{
		name: 'counterparties-counts-by-status',
		endpoint: REFERENCES_COUNTERPARTIES_CONTROLLER.concat('/counts-by-status'),
		allowedActions: [ResourceActions.READ],
	},
];

export default resources;
