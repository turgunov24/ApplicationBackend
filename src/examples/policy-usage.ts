/**
 * Policy System Usage Examples
 *
 * This file demonstrates how to use the ABAC (Attribute-Based Access Control) system
 * implemented with the accesscontrol library and dynamic roles from the database.
 */

import { PolicyService } from '../policy/service';
import {
	PolicyResources,
	PolicyActions,
	PolicyPossession,
	UserWithRoles,
} from '../policy/types';

// Example 1: Basic Permission Checking
export async function basicPermissionExample() {
	const policyService = new PolicyService();

	// Example user with roles
	const user: UserWithRoles = {
		id: 1,
		username: 'admin_user',
		email: 'admin@example.com',
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

	// Check if user can create users
	const canCreateUsers = policyService.checkPermission(
		user,
		PolicyResources.USERS,
		PolicyActions.CREATE,
		PolicyPossession.ANY
	);

	console.log('Can create users:', canCreateUsers.granted);
	console.log('Allowed attributes:', canCreateUsers.attributes);

	// Check if user can read their own profile
	const canReadOwnProfile = policyService.checkPermission(
		user,
		PolicyResources.USERS,
		PolicyActions.READ,
		PolicyPossession.OWN
	);

	console.log('Can read own profile:', canReadOwnProfile.granted);
}

// Example 2: Middleware Usage in Express Routes
export function middlewareUsageExample() {
	// In your route handlers, you can use the permission middleware like this:
	// For reading any users (admin functionality)
	// router.get('/users',
	//   parseUserFromToken,
	//   checkAnyResourcePermission(PolicyResources.USERS, PolicyActions.READ),
	//   getUsersHandler
	// );
	// For updating own profile (user functionality)
	// router.put('/users/profile',
	//   parseUserFromToken,
	//   checkOwnResourcePermission(PolicyResources.USERS, PolicyActions.UPDATE),
	//   updateProfileHandler
	// );
	// For creating countries (admin functionality)
	// router.post('/countries',
	//   parseUserFromToken,
	//   checkAnyResourcePermission(PolicyResources.COUNTRIES, PolicyActions.CREATE),
	//   createCountryHandler
	// );
}

// Example 3: Multiple Permission Checking
export function multiplePermissionsExample() {
	// You can check multiple permissions at once
	// User needs ALL permissions (AND logic)
	// router.get('/admin-dashboard',
	//   parseUserFromToken,
	//   checkMultiplePermissions([
	//     { resource: PolicyResources.USERS, action: PolicyActions.READ },
	//     { resource: PolicyResources.COUNTRIES, action: PolicyActions.READ },
	//     { resource: PolicyResources.ROLES, action: PolicyActions.READ }
	//   ]),
	//   adminDashboardHandler
	// );
	// User needs ANY permission (OR logic)
	// router.get('/reports',
	//   parseUserFromToken,
	//   checkAnyPermission([
	//     { resource: PolicyResources.USERS, action: PolicyActions.READ },
	//     { resource: PolicyResources.COUNTRIES, action: PolicyActions.READ }
	//   ]),
	//   reportsHandler
	// );
}

// Example 4: Dynamic Role Loading
export async function dynamicRoleExample() {
	const policyService = new PolicyService();

	// The policy service automatically loads roles and permissions from the database
	// and refreshes them every 5 minutes (configurable)

	// You can manually refresh if needed
	await policyService.refreshGrants();

	// Get current grants (for debugging)
	const grants = policyService.getGrants();
	console.log('Current grants:', grants);
}

// Example 5: Resource and Action Mapping
export function resourceActionMappingExample() {
	// Resources are mapped from your API endpoints:
	// /api/users -> PolicyResources.USERS
	// /api/references/countries -> PolicyResources.COUNTRIES
	// /api/references/regions -> PolicyResources.REGIONS
	// /api/references/districts -> PolicyResources.DISTRICTS
	// /api/references/roles -> PolicyResources.ROLES
	// /api/references/permissions -> PolicyResources.PERMISSIONS
	// /api/references/permission-groups -> PolicyResources.PERMISSION_GROUPS
	// /api/references/roles-permissions -> PolicyResources.ROLES_PERMISSIONS
	// Actions are mapped from HTTP methods and permission names:
	// POST -> PolicyActions.CREATE
	// GET -> PolicyActions.READ
	// PUT -> PolicyActions.UPDATE
	// DELETE -> PolicyActions.DELETE
	// Possession determines scope:
	// PolicyPossession.OWN -> User can only access their own resources
	// PolicyPossession.ANY -> User can access any resources (admin level)
}

// Example 6: Error Handling
export function errorHandlingExample() {
	// The middleware automatically handles various error cases:
	// 401 - User not authenticated (no token or invalid token)
	// 403 - User authenticated but lacks required permissions
	// 500 - Internal server error during permission checking
	// Error responses include descriptive messages:
	// "Authentication required"
	// "No roles assigned to user"
	// "Access denied: insufficient permissions for create on users"
}

// Example 7: Testing
export function testingExample() {
	// Use the test files in src/tests/ to see how to test the policy system:
	// - src/tests/policy/service.test.ts - Test the PolicyService
	// - src/tests/middlewares/checkPermission.test.ts - Test permission middleware
	// - src/tests/middlewares/parseUserFromToken.test.ts - Test user parsing middleware
	// Run tests with:
	// npm test
	// npm run test:watch
	// npm run test:coverage
}

// Example 8: Configuration
export function configurationExample() {
	// You can configure the policy service:
	const customPolicyService = new PolicyService({
		refreshInterval: 10 * 60 * 1000, // 10 minutes instead of 5
		enableCaching: true, // Enable memory caching
		enableRoleInheritance: true, // Enable role inheritance
	});

	// Configuration options:
	// - refreshInterval: How often to refresh grants from database (ms)
	// - enableCaching: Whether to cache grants in memory
	// - enableRoleInheritance: Whether to support role inheritance
}
