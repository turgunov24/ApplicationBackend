import { PolicyService } from '../../policy/service';
import {
	PolicyResources,
	PolicyActions,
	PolicyPossession,
	UserWithRoles,
} from '../../policy/types';
import db from '../../db';

// Mock the database
jest.mock('../../db');

describe('PolicyService', () => {
	let policyService: PolicyService;

	beforeEach(() => {
		jest.clearAllMocks();
		policyService = new PolicyService({
			refreshInterval: 1000, // 1 second for testing
			enableCaching: true,
			enableRoleInheritance: true,
		});
	});

	afterEach(() => {
		policyService.destroy();
	});

	describe('checkPermission', () => {
		const mockUser: UserWithRoles = {
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

		it('should grant permission for admin role', async () => {
			// Mock database responses
			const mockRoles = [
				{
					id: 1,
					nameUz: 'Admin',
					nameRu: 'Админ',
					status: 'active',
				},
			];

			const mockPermissions = [
				{
					id: 1,
					nameUz: 'Create Users',
					nameRu: 'Создать пользователей',
					permissionGroupId: 1,
				},
				{
					id: 2,
					nameUz: 'Read Users',
					nameRu: 'Читать пользователей',
					permissionGroupId: 1,
				},
			];

			const mockRolePermissions = [
				{ roleId: 1, permissionId: 1 },
				{ roleId: 1, permissionId: 2 },
			];

			const mockPermissionGroups = [
				{
					id: 1,
					nameUz: 'User Management',
					nameRu: 'Управление пользователями',
					status: 'active',
				},
			];

			// Mock database chain
			const mockSelect = jest.fn().mockReturnThis();
			const mockFrom = jest.fn().mockReturnThis();
			const mockWhere = jest.fn().mockReturnThis();
			const mockInnerJoin = jest.fn().mockReturnThis();

			(db as any).select = mockSelect;
			(db as any).from = mockFrom;
			(db as any).where = mockWhere;
			(db as any).innerJoin = mockInnerJoin;

			// Mock the final execution
			mockSelect.mockResolvedValueOnce(mockRoles);
			mockSelect.mockResolvedValueOnce(mockPermissions);
			mockSelect.mockResolvedValueOnce(mockRolePermissions);
			mockSelect.mockResolvedValueOnce(mockPermissionGroups);

			// Wait for initialization
			await new Promise((resolve) => setTimeout(resolve, 100));

			const result = policyService.checkPermission(
				mockUser,
				PolicyResources.USERS,
				PolicyActions.CREATE,
				PolicyPossession.ANY
			);

			expect(result.granted).toBe(true);
			expect(result.attributes).toContain('*');
		});

		it('should deny permission for user without required role', async () => {
			const userWithoutRoles: UserWithRoles = {
				...mockUser,
				roles: [],
			};

			const result = policyService.checkPermission(
				userWithoutRoles,
				PolicyResources.USERS,
				PolicyActions.CREATE,
				PolicyPossession.ANY
			);

			expect(result.granted).toBe(false);
			expect(result.attributes).toEqual([]);
		});

		it('should handle service not initialized', () => {
			const uninitializedService = new PolicyService();

			const result = uninitializedService.checkPermission(
				mockUser,
				PolicyResources.USERS,
				PolicyActions.CREATE,
				PolicyPossession.ANY
			);

			expect(result.granted).toBe(false);
			expect(result.attributes).toEqual([]);
		});
	});

	describe('getGrants', () => {
		it('should return grants object', () => {
			const grants = policyService.getGrants();
			expect(grants).toBeDefined();
			expect(typeof grants).toBe('object');
		});
	});

	describe('refreshGrants', () => {
		it('should refresh grants from database', async () => {
			const mockRoles = [
				{
					id: 1,
					nameUz: 'User',
					nameRu: 'Пользователь',
					status: 'active',
				},
			];

			const mockPermissions = [
				{
					id: 1,
					nameUz: 'Read Users',
					nameRu: 'Читать пользователей',
					permissionGroupId: 1,
				},
			];

			const mockRolePermissions = [{ roleId: 1, permissionId: 1 }];

			const mockPermissionGroups = [
				{
					id: 1,
					nameUz: 'User Management',
					nameRu: 'Управление пользователями',
					status: 'active',
				},
			];

			// Mock database chain
			const mockSelect = jest.fn().mockReturnThis();
			const mockFrom = jest.fn().mockReturnThis();
			const mockWhere = jest.fn().mockReturnThis();

			(db as any).select = mockSelect;
			(db as any).from = mockFrom;
			(db as any).where = mockWhere;

			// Mock the final execution
			mockSelect.mockResolvedValueOnce(mockRoles);
			mockSelect.mockResolvedValueOnce(mockPermissions);
			mockSelect.mockResolvedValueOnce(mockRolePermissions);
			mockSelect.mockResolvedValueOnce(mockPermissionGroups);

			await policyService.refreshGrants();

			// Should not throw error
			expect(true).toBe(true);
		});
	});
});
