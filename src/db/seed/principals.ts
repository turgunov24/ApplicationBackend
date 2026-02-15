import { InferSelectModel } from 'drizzle-orm';
import * as schemas from '../schemas/index';

export const principals: Array<
	Pick<
		InferSelectModel<typeof schemas.principalsTable>,
		'username' | 'fullName' | 'email' | 'phone' | 'password' | 'createdBy'
	> & {
		districtName: string;
	}
> = [
	{
		username: 'principal1',
		fullName: 'Principal One',
		email: 'principal1@gmail.com',
		phone: '998901234567',
		password: 'password123',
		createdBy: 2, // Created by Admin (id: 2)
		districtName: 'Baliqchi tumani',
	},
	{
		username: 'principal2',
		fullName: 'Principal Two',
		email: 'principal2@gmail.com',
		phone: '998907654321',
		password: 'password123',
		createdBy: 2, // Created by Admin (id: 2)
		districtName: 'Urgut tumani',
	},
];
