import { AccessControl } from 'accesscontrol';

const ac = new AccessControl();

ac.grant('admin')
	.createAny('country')
	.readAny('country')
	.updateAny('country')
	.deleteAny('country');
