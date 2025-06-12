'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { canAccessRoute } from '@/data/filtered-sidebar-menus';
import { UserRole } from '@/utils/rolePermissions';

interface RouteGuardProps {
  children: React.ReactNode;
}

export default function RouteGuard({ children }: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user: authUser, accessToken } = useSelector(
    (state: any) => state.auth
  );
  const user = authUser?.data?.user;

  useEffect(() => {
    // Skip route guard for login, register, and forgot-password pages
    const publicRoutes = ['/login', '/register', '/forgot-password'];
    if (publicRoutes.includes(pathname)) {
      return;
    }

    // Check if user is authenticated
    if (!accessToken || !user) {
      router.push('/login');
      return;
    }

    // Check if user has permission to access this route
    const userRole = user.role as UserRole;
    if (!canAccessRoute(userRole, pathname)) {
      // Redirect to first accessible route or profile
      const firstAccessibleRoute = getFirstAccessibleRoute(userRole);
      if (firstAccessibleRoute && firstAccessibleRoute !== pathname) {
        router.push(firstAccessibleRoute);
        return;
      }

      // If no accessible route found, redirect to unauthorized page or profile
      router.push('/profile');
    }
  }, [pathname, accessToken, user, router]);

  // Skip rendering for unauthenticated users or unauthorized access
  const publicRoutes = ['/login', '/register', '/forgot-password'];
  if (publicRoutes.includes(pathname)) {
    return <>{children}</>;
  }

  if (!accessToken || !user) {
    return null; // or loading spinner
  }

  const userRole = user.role as UserRole;
  if (!canAccessRoute(userRole, pathname)) {
    return null; // or unauthorized component
  }

  return <>{children}</>;
}

// Helper function to get the first accessible route for a user role
function getFirstAccessibleRoute(userRole: UserRole): string | null {
  const routesToCheck = [
    '/dashboard',
    '/orders',
    '/carts',
    '/profile',
    '/product-list',
    '/category',
    '/brands',
    '/reviews',
    '/coupon',
    '/our-staff',
    '/blog-category',
  ];

  for (const route of routesToCheck) {
    if (canAccessRoute(userRole, route)) {
      return route;
    }
  }

  return null;
}
