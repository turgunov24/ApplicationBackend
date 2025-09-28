import { InferSelectModel } from 'drizzle-orm';
import { usersTable } from '../db/schemas';

export type AuthenticatedUser = InferSelectModel<typeof usersTable>;

export enum ResourceActions {
	CREATE = 'create',
	READ = 'read',
	UPDATE = 'update',
	DELETE = 'delete',
}

export interface Resource {
	name: string;
	endpoint: string;
	allowedActions: Array<ResourceActions>;
}

// Extend Express Request interface to include user
declare global {
	namespace Express {
		interface Request {
			user: AuthenticatedUser;
		}
	}
}
