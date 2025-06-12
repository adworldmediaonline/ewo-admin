'use client';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { UserRole } from '@/utils/rolePermissions';

export default function UnauthorizedAccess() {
  const { user: authUser } = useSelector((state: any) => state.auth);
  const user = authUser?.data?.user;
  const userRole = user?.role as UserRole;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-4">
            You don&apos;t have permission to access this page.
          </p>
          {userRole && (
            <div className="bg-gray-100 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-700">
                Your current role:{' '}
                <span className="font-semibold text-theme">{userRole}</span>
              </p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {userRole === 'Admin' && (
            <Link
              href="/dashboard"
              className="block w-full bg-theme hover:bg-theme-dark text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Go to Dashboard
            </Link>
          )}

          {(userRole === 'Super Admin' ||
            userRole === 'Manager' ||
            userRole === 'CEO') && (
            <>
              <Link
                href="/orders"
                className="block w-full bg-theme hover:bg-theme-dark text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                View Orders
              </Link>
              <Link
                href="/carts"
                className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
              >
                View Carts
              </Link>
            </>
          )}

          <Link
            href="/profile"
            className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
          >
            Go to Profile
          </Link>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            If you believe this is an error, please contact your administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
