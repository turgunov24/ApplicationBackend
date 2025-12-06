import { InferSelectModel } from 'drizzle-orm';
import * as schemas from '../schemas/index';

export const users: Array<
	Pick<
		InferSelectModel<typeof schemas.usersTable>,
		'username' | 'fullName' | 'email' | 'phone' | 'password'
	> & {
		districtName: string;
		roleName: string;
	}
> = [
	{
		username: 'admin',
		fullName: 'Admin Adminovich Adminov',
		email: 'admin@gmail.com',
		phone: '998900336660',
		password: 'admin1234',
		districtName: 'Baliqchi tumani',
		roleName: 'Admin',
	},
	{
		username: 'murod',
		fullName: 'Murodjon Turgunov',
		email: 'murod@gmail.com',
		phone: '998937334337',
		password: 'murod1234',
		districtName: 'Urgut tumani',
		roleName: 'Foydalanuvchi',
	},
];
