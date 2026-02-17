import { InferSelectModel } from 'drizzle-orm';
import { usersTable } from '../db/schemas';
import { principalsTable } from '../db/schemas/principals';

export type AuthenticatedUser = InferSelectModel<typeof usersTable>;
export type AuthenticatedPrincipal = InferSelectModel<typeof principalsTable>;

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

// Extend Express Request interface to include user and principal
declare global {
	namespace Express {
		interface Request {
			user: AuthenticatedUser;
			principal: AuthenticatedPrincipal;
		}
	}
}
