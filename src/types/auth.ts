import { InferSelectModel } from 'drizzle-orm';
import { usersTable } from '../db/schemas';

export type AuthenticatedUser = InferSelectModel<typeof usersTable>;

// Extend Express Request interface to include user
declare global {
	namespace Express {
		interface Request {
			user: AuthenticatedUser;
		}
	}
}
