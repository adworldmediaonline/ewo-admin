'use client';
import { useSelector } from 'react-redux';
import Wrapper from '@/layout/wrapper';
import Breadcrumb from '../components/breadcrumb/breadcrumb';
import EnhancedCouponArea from '../components/coupon/enhanced-coupon-area';
import { hasPermission, UserRole } from '@/utils/rolePermissions';
import UnauthorizedAccess from '@/components/UnauthorizedAccess';

export default function CouponPage() {
  // Get user role from Redux store
  const { user } = useSelector((state: any) => state.auth);
  const userRole = user?.role as UserRole;

  // Check if user has permission to view coupons
  if (!hasPermission(userRole, 'canViewCoupons')) {
    return (
      <Wrapper>
        <UnauthorizedAccess />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100">
        {/* breadcrumb start */}
        <Breadcrumb title="Coupon Management" subtitle="Admin Only - Coupon List" />
        {/* breadcrumb end */}

        {/* coupon area start */}
        <EnhancedCouponArea />
        {/* coupon area end */}
      </div>
    </Wrapper>
  );
}
