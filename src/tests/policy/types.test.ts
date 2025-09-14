import {
	PolicyResources,
	PolicyActions,
	PolicyPossession,
	UserWithRoles,
} from '../../policy/types';

describe('Policy Types', () => {
	describe('PolicyResources', () => {
		it('should have all required resource constants', () => {
			expect(PolicyResources.USERS).toBe('users');
			expect(PolicyResources.COUNTRIES).toBe('countries');
			expect(PolicyResources.REGIONS).toBe('regions');
			expect(PolicyResources.DISTRICTS).toBe('districts');
			expect(PolicyResources.ROLES).toBe('roles');
			expect(PolicyResources.PERMISSIONS).toBe('permissions');
			expect(PolicyResources.PERMISSION_GROUPS).toBe('permission-groups');
			expect(PolicyResources.ROLES_PERMISSIONS).toBe('roles-permissions');
		});
	});

	describe('PolicyActions', () => {
		it('should have all required action constants', () => {
			expect(PolicyActions.CREATE).toBe('create');
			expect(PolicyActions.READ).toBe('read');
			expect(PolicyActions.UPDATE).toBe('update');
			expect(PolicyActions.DELETE).toBe('delete');
		});
	});

	describe('PolicyPossession', () => {
		it('should have all required possession constants', () => {
			expect(PolicyPossession.OWN).toBe('own');
			expect(PolicyPossession.ANY).toBe('any');
		});
	});

	describe('UserWithRoles', () => {
		it('should create valid user with roles object', () => {
			const user: UserWithRoles = {
				id: 1,
				username: 'testuser',
				email: 'test@example.com',
				status: 'active',
				roles: [
					{
						id: 1,
						nameUz: 'Admin',
						nameRu: 'Админ',
						descriptionUz: 'System administrator',
						descriptionRu: 'Системный администратор',
						status: 'active',
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				],
			};

			expect(user.id).toBe(1);
			expect(user.username).toBe('testuser');
			expect(user.email).toBe('test@example.com');
			expect(user.status).toBe('active');
			expect(user.roles).toHaveLength(1);
			expect(user.roles[0].nameUz).toBe('Admin');
		});
	});
});
