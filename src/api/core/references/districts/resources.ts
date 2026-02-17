import { REFERENCES_DISTRICTS_CONTROLLER } from '../../../../helpers/endPoints';
import { Resource, ResourceActions } from '../../../../types/auth';

const resources: Resource[] = [
	{
		name: 'districts-crud',
		endpoint: REFERENCES_DISTRICTS_CONTROLLER,
		allowedActions: [
			ResourceActions.CREATE,
			ResourceActions.UPDATE,
			ResourceActions.READ,
			ResourceActions.DELETE,
		],
	},
	{
		name: 'districts-list',
		endpoint: REFERENCES_DISTRICTS_CONTROLLER.concat('/list'),
		allowedActions: [ResourceActions.READ],
	},
	{
		name: 'districts-counts-by-status',
		endpoint: REFERENCES_DISTRICTS_CONTROLLER.concat('/counts-by-status'),
		allowedActions: [ResourceActions.READ],
	},	
];

export default resources;
