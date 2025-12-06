import { REFERENCES_COUNTRIES_CONTROLLER } from '../../../helpers/endPoints';
import { Resource, ResourceActions } from '../../../types/auth';

const resources: Resource[] = [
	{
		// bu yerda bittalab junatishimiz kerak
		name: 'countries-crud',
		endpoint: REFERENCES_COUNTRIES_CONTROLLER,
		allowedActions: [
			ResourceActions.CREATE,
			ResourceActions.UPDATE,
			ResourceActions.READ,
			ResourceActions.DELETE,
		],
	},
	{
		name: 'countries-list',
		endpoint: REFERENCES_COUNTRIES_CONTROLLER.concat('/list'),
		allowedActions: [ResourceActions.READ],
	},
	{
		name: 'countries-counts-by-status',
		endpoint: REFERENCES_COUNTRIES_CONTROLLER.concat('/counts-by-status'),
		allowedActions: [ResourceActions.READ],
	},	
];

export default resources;
