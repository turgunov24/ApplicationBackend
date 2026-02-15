import { InferSelectModel } from 'drizzle-orm';
import * as schemas from '../schemas/index';

export const roleNamesForSeeding = {
	SUPER_ADMIN: 'Superadmin',
	ADMIN: 'Admin',
	USER: 'Foydalanuvchi',
};



export const users: Array<
	Pick<
		InferSelectModel<typeof schemas.usersTable>,
		| 'username'
		| 'fullName'
		| 'email'
		| 'phone'
		| 'password'
		| 'createdBy'
		| 'id'
	> & {
		districtName: string;
		roleName: string;
	}
> = [
	{
		id: Number(process.env.SUPER_ADMIN_ID),
		createdBy: Number(process.env.SUPER_ADMIN_ID),
		username: 'superadmin',
		fullName: 'Super Admin',
		email: 'superadmin@gmail.com',
		phone: '998900336660',
		password: '123456',
		districtName: 'Baliqchi tumani',
		roleName: roleNamesForSeeding.SUPER_ADMIN,
	},
	{
		id: 2,
		createdBy: 1,
		username: 'admin1',
		fullName: 'Admin Adminovich Adminov',
		email: 'admin@gmail.com',
		phone: '998937334337',
		password: 'admin1234',
		districtName: 'Urgut tumani',
		roleName: roleNamesForSeeding.ADMIN,
	},
	{
		id: 3,
		createdBy: 1,
		username: 'admin2',
		fullName: 'Admin Adminovich Adminov 2',
		email: 'admin2@gmail.com',
		phone: '998937334339',
		password: 'admin1234',
		districtName: 'Abayskiy tumani',
		roleName: roleNamesForSeeding.ADMIN,
	},
	{
		id: 4,
		createdBy: 2,
		username: 'user',
		fullName: 'User Userovich Userov',
		email: 'user@gmail.com',
		phone: '998883982333',
		password: 'user1234',
		districtName: 'Narpay tumani',
		roleName: roleNamesForSeeding.USER,
	},
];
