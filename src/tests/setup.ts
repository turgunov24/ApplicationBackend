import 'dotenv/config';

// Mock database for testing
jest.mock('../db', () => {
	const mockSelect = jest.fn(() => ({
		from: jest.fn(() => ({
			where: jest.fn(() => Promise.resolve([])),
			innerJoin: jest.fn(() => ({
				where: jest.fn(() => Promise.resolve([])),
			})),
		})),
	}));

	return {
		select: mockSelect,
		from: jest.fn(),
		where: jest.fn(),
		innerJoin: jest.fn(),
		insert: jest.fn(),
		update: jest.fn(),
		delete: jest.fn(),
		eq: jest.fn(),
		and: jest.fn(),
		ne: jest.fn(),
		inArray: jest.fn(),
	};
});

// Mock logger
jest.mock('../utils/logger', () => ({
	logger: {
		info: jest.fn(),
		warn: jest.fn(),
		error: jest.fn(),
	},
}));

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';
