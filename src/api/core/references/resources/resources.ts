import { REFERENCES_RESOURCES_CONTROLLER } from '../../../../helpers/endPoints';
import { Resource, ResourceActions } from '../../../../types/auth';

const resources: Resource[] = [
	{
		name: 'resources-list',
		endpoint: REFERENCES_RESOURCES_CONTROLLER,
		allowedActions: [ResourceActions.READ],
	},
];

export default resources;
