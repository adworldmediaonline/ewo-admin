# Role-Based Access Control (RBAC) Implementation

## Overview

This implementation provides comprehensive Role-Based Access Control for the EWO Admin Panel, restricting access to features and pages based on user roles.

## Roles and Permissions

### Admin
- **Full Access**: Complete access to all features and pages
- **Permissions**: Dashboard, Products, Categories, Orders, Carts, Brands, Reviews, Coupons, Profile, Staff Management, Blog Categories

### Super Admin, Manager, CEO
- **Limited Access**: Only Orders and Carts functionality
- **Permissions**: Orders, Carts, Profile (restricted access)

## Backend Implementation

### 1. Role-Based Middleware (`/middleware/roleAuth.js`)
```javascript
const roleAuth = (...allowedRoles) => {
  return (req, res, next) => {
    // Check user authentication and role permissions
  };
};
```

### 2. Enhanced Authentication (`/config/auth.js`)
- Updated `isAuth` middleware to include role information
- Fetches admin role from database for admin routes

### 3. Protected Routes (`/routes/admin.routes.js`)
- Staff management routes now require 'Admin' role
- Uses `roleAuth('Admin')` middleware for protection

### 4. Updated Login Response (`/controller/admin.controller.js`)
- Returns structured response with user role information
- Includes success/error status for better frontend handling

## Frontend Implementation

### 1. Role Permissions Configuration (`/utils/rolePermissions.ts`)
- Defines all available permissions for each role
- Helper functions to check user permissions
- Type-safe role and permission definitions

### 2. Filtered Sidebar Menu (`/data/filtered-sidebar-menus.ts`)
- Dynamically filters sidebar menu based on user role
- Maps menu items to required permissions
- Handles submenus with specific permissions

### 3. Enhanced Sidebar Component (`/layout/sidebar.tsx`)
- Uses filtered menu based on current user role
- Automatically hides/shows menu items based on permissions
- Role-aware navigation rendering

### 4. Route Guard Component (`/components/RouteGuard.tsx`)
- Protects routes based on user permissions
- Redirects unauthorized users to appropriate pages
- Handles authentication and authorization checks

### 5. Header Updates (`/layout/header.tsx`)
- Displays user role badge in profile dropdown
- Visual indication of current user's role and permissions

### 6. Unauthorized Access Component (`/components/UnauthorizedAccess.tsx`)
- User-friendly unauthorized access page
- Role-specific navigation suggestions
- Clear messaging about access restrictions

## Usage

### Backend Route Protection
```javascript
// Protect routes with specific roles
router.get('/admin-only', isAuth, roleAuth('Admin'), controller);
router.get('/multiple-roles', isAuth, roleAuth('Admin', 'Manager'), controller);
```

### Frontend Permission Checking
```javascript
import { hasPermission } from '@/utils/rolePermissions';

// Check if user has specific permission
if (hasPermission(userRole, 'canViewProducts')) {
  // Show products interface
}
```

### Route Guard Usage
```javascript
// Wrap your app with RouteGuard
<RouteGuard>
  <YourAppComponent />
</RouteGuard>
```

## Key Features

1. **Dynamic Menu Filtering**: Sidebar menu adapts based on user role
2. **Route Protection**: Automatic redirection for unauthorized access
3. **Role Display**: Visual indication of user role in header
4. **Graceful Degradation**: Proper error handling and user feedback
5. **Type Safety**: Full TypeScript support for roles and permissions
6. **Scalable**: Easy to add new roles and permissions

## Security Considerations

- Backend validation for all role-protected routes
- Frontend UI restrictions (not security-dependent)
- Token-based authentication with role information
- Proper error handling for unauthorized access
- Session management with role persistence

## Testing Scenarios

1. **Admin User**: Should have access to all features
2. **Super Admin/Manager/CEO**: Should only see Orders and Carts
3. **Unauthorized Access**: Should redirect to appropriate pages
4. **Role Changes**: Should reflect immediately in UI

## Configuration

### Adding New Roles
1. Update `UserRole` type in `/utils/rolePermissions.ts`
2. Add role permissions in `rolePermissions` object
3. Update filtering logic in `/data/filtered-sidebar-menus.ts`
4. Test with backend role validation

### Adding New Permissions
1. Add permission to `RolePermissions` interface
2. Update role-specific permissions
3. Add route mapping if needed
4. Update menu filtering logic

## Deployment Notes

- Ensure backend middleware is properly integrated
- Test role-based access in production environment
- Monitor for unauthorized access attempts
- Regular security audits recommended
