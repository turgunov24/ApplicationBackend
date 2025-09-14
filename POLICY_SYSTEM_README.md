# ABAC Policy System Implementation

This document describes the implementation of an **Attribute-Based Access Control (ABAC)** system using the [accesscontrol](https://www.npmjs.com/package/accesscontrol) library with dynamic roles loaded from the database.

## Overview

The policy system transforms your existing RBAC (Role-Based Access Control) implementation into a more powerful ABAC system that supports:

- **Dynamic roles** loaded from the database
- **Resource-based permissions** (users, countries, regions, etc.)
- **Action-based permissions** (create, read, update, delete)
- **Possession control** (own vs any resources)
- **Role inheritance** and hierarchical permissions
- **Real-time permission updates** (every 5 minutes)

## Architecture

```
Database Tables → PolicyService → Permission Middleware → API Routes
     ↓                ↓                    ↓
- roles          - Load grants        - Check permissions
- permissions    - Cache in memory    - Filter attributes
- role_permissions - Handle updates   - Return 403 if denied
- users_roles
```

## Key Components

### 1. Policy Service (`src/policy/service.ts`)

The core service that manages the AccessControl instance and loads permissions from the database.

**Features:**

- Loads roles, permissions, and mappings from database
- Transforms database data to AccessControl grants format
- Caches grants in memory for performance
- Refreshes permissions every 5 minutes
- Supports role inheritance

### 2. Permission Middleware (`src/middlewares/checkPermission.ts`)

Express middleware for checking permissions on API routes.

**Available Middleware:**

- `checkPermission(resource, action, possession)` - Basic permission check
- `checkOwnResourcePermission(resource, action)` - Check own resource access
- `checkAnyResourcePermission(resource, action)` - Check any resource access
- `checkMultiplePermissions(permissions[])` - Check multiple permissions (AND logic)
- `checkAnyPermission(permissions[])` - Check any permission (OR logic)

### 3. Enhanced User Middleware (`src/middlewares/parseUserFromToken.ts`)

Extended to load user roles along with user data.

**Features:**

- Parses JWT token
- Loads user data from database
- Loads user roles from junction table
- Validates user status

### 4. Type Definitions (`src/policy/types.ts`)

TypeScript types for the policy system.

**Key Types:**

- `PolicyResources` - Available resources (users, countries, etc.)
- `PolicyActions` - Available actions (create, read, update, delete)
- `PolicyPossession` - Possession types (own, any)
- `UserWithRoles` - User with loaded roles
- `PermissionCheckResult` - Result of permission check

## Usage Examples

### Basic Permission Checking

```typescript
import { checkAnyResourcePermission } from '../middlewares/checkPermission';
import { PolicyResources, PolicyActions } from '../policy/types';

// Check if user can read users
router.get(
	'/users',
	parseUserFromToken,
	checkAnyResourcePermission(PolicyResources.USERS, PolicyActions.READ),
	getUsersHandler
);
```

### Own Resource Access

```typescript
import { checkOwnResourcePermission } from '../middlewares/checkPermission';

// Check if user can update their own profile
router.put(
	'/users/profile',
	parseUserFromToken,
	checkOwnResourcePermission(PolicyResources.USERS, PolicyActions.UPDATE),
	updateProfileHandler
);
```

### Multiple Permissions

```typescript
import { checkMultiplePermissions } from '../middlewares/checkPermission';

// User needs ALL permissions
router.get(
	'/admin-dashboard',
	parseUserFromToken,
	checkMultiplePermissions([
		{ resource: PolicyResources.USERS, action: PolicyActions.READ },
		{ resource: PolicyResources.COUNTRIES, action: PolicyActions.READ },
		{ resource: PolicyResources.ROLES, action: PolicyActions.READ },
	]),
	adminDashboardHandler
);
```

### Any Permission

```typescript
import { checkAnyPermission } from '../middlewares/checkPermission';

// User needs ANY permission
router.get(
	'/reports',
	parseUserFromToken,
	checkAnyPermission([
		{ resource: PolicyResources.USERS, action: PolicyActions.READ },
		{ resource: PolicyResources.COUNTRIES, action: PolicyActions.READ },
	]),
	reportsHandler
);
```

## Resource and Action Mapping

### Resources

| API Endpoint                        | Resource Constant                   |
| ----------------------------------- | ----------------------------------- |
| `/api/users`                        | `PolicyResources.USERS`             |
| `/api/references/countries`         | `PolicyResources.COUNTRIES`         |
| `/api/references/regions`           | `PolicyResources.REGIONS`           |
| `/api/references/districts`         | `PolicyResources.DISTRICTS`         |
| `/api/references/roles`             | `PolicyResources.ROLES`             |
| `/api/references/permissions`       | `PolicyResources.PERMISSIONS`       |
| `/api/references/permission-groups` | `PolicyResources.PERMISSION_GROUPS` |
| `/api/references/roles-permissions` | `PolicyResources.ROLES_PERMISSIONS` |

### Actions

| HTTP Method | Action Constant        |
| ----------- | ---------------------- |
| `POST`      | `PolicyActions.CREATE` |
| `GET`       | `PolicyActions.READ`   |
| `PUT`       | `PolicyActions.UPDATE` |
| `DELETE`    | `PolicyActions.DELETE` |

### Possession

| Type                   | Description                                 |
| ---------------------- | ------------------------------------------- |
| `PolicyPossession.OWN` | User can only access their own resources    |
| `PolicyPossession.ANY` | User can access any resources (admin level) |

## Database Integration

The system automatically maps your existing database structure:

1. **Roles** from `references_roles` table
2. **Permissions** from `references_permissions` table
3. **Permission Groups** from `references_permission_groups` table
4. **Role-Permission Mappings** from `references_roles_permissions` table
5. **User-Role Mappings** from `users_roles` table

### Permission Group to Resource Mapping

The system maps permission group names to resources:

- Groups containing "user" → `users` resource
- Groups containing "country" → `countries` resource
- Groups containing "region" → `regions` resource
- Groups containing "district" → `districts` resource
- Groups containing "role" → `roles` resource
- Groups containing "permission" → `permissions` resource
- Groups containing "group" → `permission-groups` resource

### Permission Name to Action Mapping

The system maps permission names to actions:

- Permissions containing "create" or "add" → `create` action
- Permissions containing "read", "view", or "list" → `read` action
- Permissions containing "update", "edit", or "modify" → `update` action
- Permissions containing "delete" or "remove" → `delete` action

## Configuration

The PolicyService can be configured with custom settings:

```typescript
import { PolicyService } from './policy/service';

const policyService = new PolicyService({
	refreshInterval: 10 * 60 * 1000, // 10 minutes instead of 5
	enableCaching: true, // Enable memory caching
	enableRoleInheritance: true, // Enable role inheritance
});
```

## Error Handling

The middleware automatically handles various error cases:

- **401 Unauthorized** - User not authenticated (no token or invalid token)
- **403 Forbidden** - User authenticated but lacks required permissions
- **500 Internal Server Error** - Error during permission checking

Error responses include descriptive messages:

- "Authentication required"
- "No roles assigned to user"
- "Access denied: insufficient permissions for create on users"

## Testing

The system includes comprehensive tests:

```bash
# Run all tests
npm test

# Run specific test files
npm test -- --testPathPatterns="policy"

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

### Test Files

- `src/tests/policy/types.test.ts` - Test policy types
- `src/tests/policy/service.test.ts` - Test PolicyService
- `src/tests/middlewares/checkPermission.test.ts` - Test permission middleware
- `src/tests/middlewares/parseUserFromToken.test.ts` - Test user parsing middleware
- `src/tests/integration/policy-integration.test.ts` - Integration tests

## Performance Considerations

1. **Memory Caching** - Grants are cached in memory for fast access
2. **Periodic Refresh** - Permissions are refreshed every 5 minutes
3. **Database Optimization** - Uses efficient queries with proper indexing
4. **Middleware Ordering** - Permission checks happen after authentication

## Security Features

1. **JWT Token Validation** - Secure token parsing and validation
2. **Role-based Access** - Users can only access resources based on their roles
3. **Possession Control** - Distinction between own and any resource access
4. **Input Validation** - All inputs are validated before processing
5. **Error Handling** - Secure error messages without information leakage

## Migration from RBAC

The system is designed to work with your existing database structure:

1. **No Schema Changes** - Uses existing tables
2. **Backward Compatible** - Existing API endpoints continue to work
3. **Gradual Migration** - Can be applied to routes incrementally
4. **Enhanced Security** - Adds more granular permission control

## Troubleshooting

### Common Issues

1. **Permission Denied** - Check if user has required roles and permissions
2. **Service Not Initialized** - Ensure PolicyService is properly initialized
3. **Database Connection** - Verify database connection and table structure
4. **Token Issues** - Check JWT token validity and user status

### Debugging

Enable debug logging by setting the log level:

```typescript
// In your logger configuration
logger.level = 'debug';
```

### Manual Permission Refresh

```typescript
import { policyService } from './policy/service';

// Manually refresh permissions
await policyService.refreshGrants();
```

## Future Enhancements

1. **Attribute Filtering** - Control which fields users can access
2. **Context-aware Permissions** - Permissions based on time, location, etc.
3. **Audit Logging** - Track permission checks and access attempts
4. **Permission Templates** - Predefined permission sets for common roles
5. **Real-time Updates** - WebSocket-based permission updates

## Conclusion

The ABAC policy system provides a robust, scalable, and secure way to manage permissions in your application. It builds upon your existing RBAC foundation while adding the flexibility and power of attribute-based access control.

For more examples and detailed usage, see `src/examples/policy-usage.ts`.
