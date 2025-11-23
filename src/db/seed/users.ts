import { InferSelectModel } from 'drizzle-orm';
import * as schemas from '../schemas/index';

export const roles: Array<
	Pick<
		InferSelectModel<typeof schemas.usersTable>,
		| 'username'
		| 'fullName'
		| 'email'
		| 'phone'
		| 'countryId'
		| 'regionId'
		| 'cityId'
		| 'password'
	>
> = [
	// {

	// },
];
