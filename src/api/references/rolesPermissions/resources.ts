import { REFERENCES_ROLES_PERMISSIONS_CONTROLLER } from '../../../helpers/endPoints';
import { Resource, ResourceActions } from '../../../types/auth';

const resources: Resource[] = [
	{
		name: 'roles-permissions',
		endpoint: REFERENCES_ROLES_PERMISSIONS_CONTROLLER,
		allowedActions: [ResourceActions.UPDATE, ResourceActions.READ],
	},
];

export default resources;
