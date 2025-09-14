import { Request, Response, NextFunction } from 'express';
import {
	checkPermission,
	checkOwnResourcePermission,
	checkAnyResourcePermission,
} from '../../middlewares/checkPermission';
import {
	PolicyResources,
	PolicyActions,
	PolicyPossession,
	UserWithRoles,
} from '../../policy/types';
import { policyService } from '../../policy/service';

// Mock the policy service
jest.mock('../../policy/service', () => ({
	policyService: {
		checkPermission: jest.fn(),
	},
}));

describe('Permission Middleware', () => {
	let mockReq: Partial<Request>;
	let mockRes: Partial<Response>;
	let mockNext: NextFunction;

	beforeEach(() => {
		jest.clearAllMocks();

		mockReq = {
			user: {
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
			} as UserWithRoles,
		};

		mockRes = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis(),
		};

		mockNext = jest.fn();
	});

	describe('checkPermission', () => {
		it('should allow access when user has permission', () => {
			(policyService.checkPermission as jest.Mock).mockReturnValue({
				granted: true,
				attributes: ['*'],
			});

			const middleware = checkPermission(
				PolicyResources.USERS,
				PolicyActions.CREATE,
				PolicyPossession.ANY
			);

			middleware(mockReq as Request, mockRes as Response, mockNext);

			expect(mockNext).toHaveBeenCalled();
			expect(mockReq.permission).toEqual({
				granted: true,
				attributes: ['*'],
			});
		});

		it('should deny access when user lacks permission', () => {
			(policyService.checkPermission as jest.Mock).mockReturnValue({
				granted: false,
				attributes: [],
			});

			const middleware = checkPermission(
				PolicyResources.USERS,
				PolicyActions.CREATE,
				PolicyPossession.ANY
			);

			middleware(mockReq as Request, mockRes as Response, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(403);
			expect(mockRes.json).toHaveBeenCalled();
			expect(mockNext).not.toHaveBeenCalled();
		});

		it('should return 401 when user is not authenticated', () => {
			mockReq.user = undefined;

			const middleware = checkPermission(
				PolicyResources.USERS,
				PolicyActions.CREATE,
				PolicyPossession.ANY
			);

			middleware(mockReq as Request, mockRes as Response, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(401);
			expect(mockRes.json).toHaveBeenCalled();
			expect(mockNext).not.toHaveBeenCalled();
		});

		it('should return 403 when user has no roles', () => {
			mockReq.user = {
				...mockReq.user!,
				roles: [],
			};

			const middleware = checkPermission(
				PolicyResources.USERS,
				PolicyActions.CREATE,
				PolicyPossession.ANY
			);

			middleware(mockReq as Request, mockRes as Response, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(403);
			expect(mockRes.json).toHaveBeenCalled();
			expect(mockNext).not.toHaveBeenCalled();
		});

		it('should handle policy service errors', () => {
			(policyService.checkPermission as jest.Mock).mockImplementation(() => {
				throw new Error('Policy service error');
			});

			const middleware = checkPermission(
				PolicyResources.USERS,
				PolicyActions.CREATE,
				PolicyPossession.ANY
			);

			middleware(mockReq as Request, mockRes as Response, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(500);
			expect(mockRes.json).toHaveBeenCalled();
			expect(mockNext).not.toHaveBeenCalled();
		});
	});

	describe('checkOwnResourcePermission', () => {
		it('should check permission with OWN possession', () => {
			(policyService.checkPermission as jest.Mock).mockReturnValue({
				granted: true,
				attributes: ['*'],
			});

			const middleware = checkOwnResourcePermission(
				PolicyResources.USERS,
				PolicyActions.UPDATE
			);

			middleware(mockReq as Request, mockRes as Response, mockNext);

			expect(policyService.checkPermission).toHaveBeenCalledWith(
				mockReq.user,
				PolicyResources.USERS,
				PolicyActions.UPDATE,
				PolicyPossession.OWN
			);
			expect(mockNext).toHaveBeenCalled();
		});
	});

	describe('checkAnyResourcePermission', () => {
		it('should check permission with ANY possession', () => {
			(policyService.checkPermission as jest.Mock).mockReturnValue({
				granted: true,
				attributes: ['*'],
			});

			const middleware = checkAnyResourcePermission(
				PolicyResources.USERS,
				PolicyActions.READ
			);

			middleware(mockReq as Request, mockRes as Response, mockNext);

			expect(policyService.checkPermission).toHaveBeenCalledWith(
				mockReq.user,
				PolicyResources.USERS,
				PolicyActions.READ,
				PolicyPossession.ANY
			);
			expect(mockNext).toHaveBeenCalled();
		});
	});
});
