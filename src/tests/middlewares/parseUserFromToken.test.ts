import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { parseUserFromToken } from '../../middlewares/parseUserFromToken';
import db from '../../db';

// Mock the database
jest.mock('../../db');

describe('parseUserFromToken Middleware', () => {
	let mockReq: Partial<Request>;
	let mockRes: Partial<Response>;
	let mockNext: NextFunction;

	beforeEach(() => {
		jest.clearAllMocks();

		mockReq = {
			headers: {
				authorization: 'Bearer valid-token',
			},
		};

		mockRes = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis(),
		};

		mockNext = jest.fn();
	});

	it('should parse user from valid token and load roles', async () => {
		const mockUser = {
			id: 1,
			username: 'testuser',
			email: 'test@example.com',
			status: 'active',
		};

		const mockRoles = [
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
		];

		// Mock JWT verification
		jest.spyOn(jwt, 'verify').mockReturnValue({
			id: 1,
			username: 'testuser',
			email: 'test@example.com',
		} as any);

		// Mock database chain for user lookup
		const mockSelect = jest.fn().mockReturnThis();
		const mockFrom = jest.fn().mockReturnThis();
		const mockWhere = jest.fn().mockReturnThis();
		const mockInnerJoin = jest.fn().mockReturnThis();

		(db as any).select = mockSelect;
		(db as any).from = mockFrom;
		(db as any).where = mockWhere;
		(db as any).innerJoin = mockInnerJoin;

		// Mock the final execution
		mockSelect.mockResolvedValueOnce([mockUser]);
		mockSelect.mockResolvedValueOnce(mockRoles);

		await parseUserFromToken(mockReq as Request, mockRes as Response, mockNext);

		expect(mockNext).toHaveBeenCalled();
		expect(mockReq.user).toEqual({
			id: 1,
			username: 'testuser',
			email: 'test@example.com',
			status: 'active',
			roles: mockRoles,
		});
	});

	it('should return 401 when no authorization header', async () => {
		mockReq.headers = {};

		await parseUserFromToken(mockReq as Request, mockRes as Response, mockNext);

		expect(mockRes.status).toHaveBeenCalledWith(401);
		expect(mockRes.json).toHaveBeenCalled();
		expect(mockNext).not.toHaveBeenCalled();
	});

	it('should return 401 when token format is invalid', async () => {
		mockReq.headers = {
			authorization: 'InvalidFormat token',
		};

		await parseUserFromToken(mockReq as Request, mockRes as Response, mockNext);

		expect(mockRes.status).toHaveBeenCalledWith(401);
		expect(mockRes.json).toHaveBeenCalled();
		expect(mockNext).not.toHaveBeenCalled();
	});

	it('should return 401 when token is invalid', async () => {
		jest.spyOn(jwt, 'verify').mockImplementation(() => {
			throw new Error('Invalid token');
		});

		await parseUserFromToken(mockReq as Request, mockRes as Response, mockNext);

		expect(mockRes.status).toHaveBeenCalledWith(401);
		expect(mockRes.json).toHaveBeenCalled();
		expect(mockNext).not.toHaveBeenCalled();
	});

	it('should return 401 when user not found', async () => {
		jest.spyOn(jwt, 'verify').mockReturnValue({
			id: 1,
			username: 'nonexistent',
			email: 'test@example.com',
		} as any);

		// Mock database chain
		const mockSelect = jest.fn().mockReturnThis();
		const mockFrom = jest.fn().mockReturnThis();
		const mockWhere = jest.fn().mockReturnThis();

		(db as any).select = mockSelect;
		(db as any).from = mockFrom;
		(db as any).where = mockWhere;

		// Mock empty result
		mockSelect.mockResolvedValueOnce([]);

		await parseUserFromToken(mockReq as Request, mockRes as Response, mockNext);

		expect(mockRes.status).toHaveBeenCalledWith(401);
		expect(mockRes.json).toHaveBeenCalled();
		expect(mockNext).not.toHaveBeenCalled();
	});

	it('should return 403 when user is not active', async () => {
		const mockUser = {
			id: 1,
			username: 'testuser',
			email: 'test@example.com',
			status: 'banned',
		};

		jest.spyOn(jwt, 'verify').mockReturnValue({
			id: 1,
			username: 'testuser',
			email: 'test@example.com',
		} as any);

		// Mock database chain
		const mockSelect = jest.fn().mockReturnThis();
		const mockFrom = jest.fn().mockReturnThis();
		const mockWhere = jest.fn().mockReturnThis();

		(db as any).select = mockSelect;
		(db as any).from = mockFrom;
		(db as any).where = mockWhere;

		// Mock user with inactive status
		mockSelect.mockResolvedValueOnce([mockUser]);

		await parseUserFromToken(mockReq as Request, mockRes as Response, mockNext);

		expect(mockRes.status).toHaveBeenCalledWith(403);
		expect(mockRes.json).toHaveBeenCalled();
		expect(mockNext).not.toHaveBeenCalled();
	});

	it('should handle database errors', async () => {
		jest.spyOn(jwt, 'verify').mockReturnValue({
			id: 1,
			username: 'testuser',
			email: 'test@example.com',
		} as any);

		// Mock database chain
		const mockSelect = jest.fn().mockReturnThis();
		const mockFrom = jest.fn().mockReturnThis();
		const mockWhere = jest.fn().mockReturnThis();

		(db as any).select = mockSelect;
		(db as any).from = mockFrom;
		(db as any).where = mockWhere;

		// Mock database error
		mockSelect.mockRejectedValueOnce(new Error('Database error'));

		await parseUserFromToken(mockReq as Request, mockRes as Response, mockNext);

		expect(mockRes.status).toHaveBeenCalledWith(500);
		expect(mockRes.json).toHaveBeenCalled();
		expect(mockNext).not.toHaveBeenCalled();
	});
});
