# Roles and Permissions Database Structure

## Overview

This document describes the new database structure that implements many-to-many relationships between users, roles, and permissions.

## Tables Created

### 1. `references_roles` Table

- **Purpose**: Stores role definitions
- **Fields**:
  - `id`: Primary key
  - `nameUz`: Role name in Uzbek
  - `nameRu`: Role name in Russian
  - `descriptionUz`: Role description in Uzbek (optional)
  - `descriptionRu`: Role description in Russian (optional)
  - `status`: Role status (active/deleted)
  - `createdAt`, `updatedAt`: Timestamps

### 2. `references_roles_permissions` Table (Junction Table)

- **Purpose**: Links roles to permissions (many-to-many)
- **Fields**:
  - `id`: Primary key
  - `roleId`: Foreign key to `references_roles.id`
  - `permissionId`: Foreign key to `references_permissions.id`
  - `createdAt`, `updatedAt`: Timestamps
- **Constraints**: Unique constraint on (roleId, permissionId) to prevent duplicates

### 3. `users_roles` Table (Junction Table)

- **Purpose**: Links users to roles (many-to-many)
- **Fields**:
  - `id`: Primary key
  - `userId`: Foreign key to `users.id`
  - `roleId`: Foreign key to `references_roles.id`
  - `createdAt`, `updatedAt`: Timestamps
- **Constraints**: Unique constraint on (userId, roleId) to prevent duplicates

## Changes Made

### Users Table

- Removed `roleId` field (was single role relationship)
- Now supports multiple roles per user through the `users_roles` junction table

## Relationships

### Role ↔ Permission (Many-to-Many)

- Each role can have multiple permissions
- Each permission can belong to multiple roles
- Junction table: `references_roles_permissions`

### User ↔ Role (Many-to-Many)

- Each user can have multiple roles
- Each role can be assigned to multiple users
- Junction table: `users_roles`

## Database Migrations

1. **0002_sparkling_richard_fisk.sql**: Creates the new tables and removes roleId from users
2. **0003_flawless_shard.sql**: Adds unique constraints to prevent duplicate relationships

## Benefits

1. **Flexibility**: Users can have multiple roles
2. **Granular Control**: Roles can have multiple permissions
3. **Scalability**: Easy to add/remove roles and permissions without affecting existing data
4. **Data Integrity**: Unique constraints prevent duplicate relationships
5. **Audit Trail**: Junction tables include timestamps for tracking changes

## Usage Examples

### Assigning a permission to a role

```sql
INSERT INTO references_roles_permissions (role_id, permission_id)
VALUES (1, 5);
```

### Assigning a role to a user

```sql
INSERT INTO users_roles (user_id, role_id)
VALUES (123, 2);
```

### Getting all permissions for a user

```sql
SELECT DISTINCT p.*
FROM users_roles ur
JOIN references_roles_permissions rp ON ur.role_id = rp.role_id
JOIN references_permissions p ON rp.permission_id = p.id
WHERE ur.user_id = 123;
```
