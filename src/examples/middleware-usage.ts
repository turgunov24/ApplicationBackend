// Example of how to use the parseUserFromToken middleware
import { Router, Request, Response, NextFunction } from 'express';
import { parseUserFromToken } from '../middlewares/parseUserFromToken';
import { AuthenticatedUser } from '../types/auth';

const router = Router();



// Example protected route that requires authentication
router.get('/profile', parseUserFromToken, (req: Request, res: Response) => {
	// At this point, req.user is guaranteed to be defined and typed as AuthenticatedUser
	const user: AuthenticatedUser = req.user; // Non-null assertion is safe here

	res.json({
		message: 'User profile retrieved successfully',
		user: {
			id: user.id,
			fullName: user.fullName,
			username: user.username,
			email: user.email,
			status: user.status,
			avatarPath: user.avatarPath,
		},
	});
});

// Example route that optionally uses authentication
router.get('/optional-auth', (req: Request, res: Response) => {
	if (req.user) {
		// User is authenticated
		res.json({
			message: 'Hello authenticated user!',
			user: req.user.username,
		});
	} else {
		// User is not authenticated
		res.json({
			message: 'Hello anonymous user!',
		});
	}
});

// Example of using the middleware conditionally
const conditionalAuth = (req: Request, res: Response, next: NextFunction) => {
	// Only apply auth middleware if Authorization header is present
	if (req.headers.authorization) {
		return parseUserFromToken(req, res, next);
	}
	next();
};

router.get('/conditional', conditionalAuth, (req: Request, res: Response) => {
	res.json({
		message: 'This route works with or without authentication',
		authenticated: !!req.user,
		user: req.user?.username || 'Anonymous',
	});
});

export default router;
