import { ISidebarMenus } from '../types/menu-types';
import sidebar_menu from './sidebar-menus';
import { UserRole, hasPermission } from '../utils/rolePermissions';

// Map menu items to their required permissions
const menuPermissions: Record<string, string> = {
  Dashboard: 'canViewDashboard',
  Products: 'canViewProducts',
  Category: 'canViewCategories',
  Orders: 'canViewOrders',
  Carts: 'canViewCarts',
  Brand: 'canViewBrands',
  Reviews: 'canViewReviews',
  Coupons: 'canViewCoupons',
  Profile: 'canViewProfile',
  'Our Staff': 'canViewStaff',
  'Blog Category': 'canViewBlogCategories',
  Pages: 'canManageStaff', // Only Admin can access Pages (Register, Login, etc.)
  'Online store': 'canViewProfile', // Allow access to online store for all roles that can view profile
};

// Map submenu items to their required permissions
const submenuPermissions: Record<string, string> = {
  'Add Product': 'canAddProducts',
  'Product List': 'canViewProducts',
  'Product Grid': 'canViewProducts',
};

// Filter sidebar menu based on user role
export const getFilteredSidebarMenu = (
  userRole: UserRole | undefined
): Array<ISidebarMenus> => {
  if (!userRole) {
    return [];
  }

  const filteredMenu = sidebar_menu
    .filter(menu => {
      // Check if user has permission for this menu item
      const requiredPermission = menuPermissions[menu.title];

      if (!requiredPermission) {
        return false; // If no permission defined, don't show
      }

      const hasMenuPermission = hasPermission(
        userRole,
        requiredPermission as any
      );

      if (!hasMenuPermission) {
        return false;
      }

      // If menu has submenus, check if at least one is accessible
      if (menu.subMenus) {
        const filteredSubMenus = menu.subMenus.filter(submenu => {
          const submenuPermission = submenuPermissions[submenu.title];
          if (!submenuPermission) {
            return hasMenuPermission; // Default to menu permission if no specific submenu permission
          }
          return hasPermission(userRole, submenuPermission as any);
        });

        // Only show menu if it has at least one accessible submenu
        if (filteredSubMenus.length === 0) {
          return false;
        }
      }

      return true;
    })
    .map(menu => {
      // If menu has submenus, return a copy with filtered submenus
      if (menu.subMenus) {
        const filteredSubMenus = menu.subMenus.filter(submenu => {
          const submenuPermission = submenuPermissions[submenu.title];
          if (!submenuPermission) {
            return hasPermission(userRole, menuPermissions[menu.title] as any);
          }
          return hasPermission(userRole, submenuPermission as any);
        });
        return { ...menu, subMenus: filteredSubMenus };
      }
      return menu;
    });

  return filteredMenu;
};

// Helper function to check if user can access a specific route
export const canAccessRoute = (
  userRole: UserRole | undefined,
  routePath: string
): boolean => {
  if (!userRole) {
    return false;
  }

  // Route permission mapping
  const routePermissions: Record<string, string> = {
    '/': 'canViewDashboard', // Root route defaults to dashboard permission
    '/dashboard': 'canViewDashboard',
    '/product-list': 'canViewProducts',
    '/product-grid': 'canViewProducts',
    '/add-product': 'canAddProducts',
    '/category': 'canViewCategories',
    '/orders': 'canViewOrders',
    '/carts': 'canViewCarts',
    '/brands': 'canViewBrands',
    '/reviews': 'canViewReviews',
    '/coupon': 'canViewCoupons',
    '/profile': 'canViewProfile',
    '/our-staff': 'canViewStaff',
    '/blog-category': 'canViewBlogCategories',
    '/register': 'canViewProfile',
    '/login': 'canViewProfile',
    '/forgot-password': 'canViewProfile',
  };

  const requiredPermission = routePermissions[routePath];
  if (!requiredPermission) {
    return false;
  }

  return hasPermission(userRole, requiredPermission as any);
};
