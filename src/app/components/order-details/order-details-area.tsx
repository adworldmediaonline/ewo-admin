'use client';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';
import Image from 'next/image';
import ErrorMsg from '../common/error-msg';
import { useGetSingleOrderQuery } from '@/redux/order/orderApi';
import { useReactToPrint } from 'react-to-print';
import { notifyError, notifySuccess } from '@/utils/toast';
import OrderStatusChange from '../orders/status-change';
import styles from './order-details-area.module.css';

// Icon Components
const PrintIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
    />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const PackageIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
    />
  </svg>
);

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const MapPinIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const CreditCardIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
    />
  </svg>
);

const EmailIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const PhoneIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
);

interface OrderDetailsAreaProps {
  id: string;
}

export default function OrderDetailsArea({ id }: OrderDetailsAreaProps) {
  const {
    data: orderData,
    isLoading,
    isError,
    refetch,
  } = useGetSingleOrderQuery(id);
  const printRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'items' | 'customer' | 'timeline'
  >('overview');

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Invoice-${orderData?.invoice || 'Unknown'}`,
    onAfterPrint: () => notifySuccess('Invoice printed successfully'),
    onPrintError: () => notifyError('Failed to print invoice'),
  });

  // Status Badge Component
  const StatusBadge = ({ status }: { status: string }) => {
    const getStatusConfig = (status: string) => {
      switch (status?.toLowerCase()) {
        case 'pending':
          return {
            bg: 'bg-yellow-100',
            text: 'text-yellow-800',
            border: 'border-yellow-200',
            icon: '⏳',
          };
        case 'processing':
          return {
            bg: 'bg-blue-100',
            text: 'text-blue-800',
            border: 'border-blue-200',
            icon: '⚡',
          };
        case 'delivered':
          return {
            bg: 'bg-green-100',
            text: 'text-green-800',
            border: 'border-green-200',
            icon: '✅',
          };
        case 'cancel':
          return {
            bg: 'bg-red-100',
            text: 'text-red-800',
            border: 'border-red-200',
            icon: '❌',
          };
        default:
          return {
            bg: 'bg-gray-100',
            text: 'text-gray-800',
            border: 'border-gray-200',
            icon: '❓',
          };
      }
    };

    const config = getStatusConfig(status);
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.bg} ${config.text} ${config.border}`}
      >
        <span className="mr-2">{config.icon}</span>
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  // Order Timeline Component
  const OrderTimeline = () => {
    if (!orderData) return null;

    const timelineSteps = [
      { name: 'Order Placed', status: 'completed', date: orderData.createdAt },
      {
        name: 'Processing',
        status:
          orderData.status === 'processing' || orderData.status === 'delivered'
            ? 'completed'
            : 'pending',
        date: null,
      },
      {
        name: 'Shipped',
        status: orderData.status === 'delivered' ? 'completed' : 'pending',
        date: null,
      },
      {
        name: 'Delivered',
        status: orderData.status === 'delivered' ? 'completed' : 'pending',
        date: null,
      },
    ];

    if (orderData.status === 'cancel') {
      return (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
              ✓
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">Order Placed</div>
              <div className="text-sm text-gray-500">
                {dayjs(orderData.createdAt).format('MMM D, YYYY at h:mm A')}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center">
              ✗
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">Order Cancelled</div>
              <div className="text-sm text-gray-500">
                {dayjs(orderData.createdAt).format('MMM D, YYYY at h:mm A')}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {timelineSteps.map((step, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                step.status === 'completed'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step.status === 'completed' ? '✓' : index + 1}
            </div>
            <div className="flex-1">
              <div
                className={`font-medium ${
                  step.status === 'completed'
                    ? 'text-gray-900'
                    : 'text-gray-500'
                }`}
              >
                {step.name}
              </div>
              {step.date && (
                <div className="text-sm text-gray-500">
                  {dayjs(step.date).format('MMM D, YYYY at h:mm A')}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Customer Section Component
  const CustomerSection = () => {
    if (!orderData) return null;

    return (
      <div className="bg-white rounded-lg shadow border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <UserIcon className="w-5 h-5 mr-2" />
          Customer Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Profile */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              {orderData.user?.imageURL ? (
                <Image
                  className="w-12 h-12 rounded-full object-cover"
                  src={orderData.user.imageURL}
                  alt="Customer"
                  width={48}
                  height={48}
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-gray-400" />
                </div>
              )}
              <div>
                <h4 className="font-semibold text-gray-900">
                  {orderData.isGuestOrder
                    ? orderData.name
                    : orderData.user?.name || orderData.name}
                </h4>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    orderData.isGuestOrder
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {orderData.isGuestOrder
                    ? 'Guest Customer'
                    : 'Registered Customer'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <EmailIcon className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-900">{orderData.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <PhoneIcon className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-900">
                  {orderData.contact}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="space-y-4">
            <h5 className="font-medium text-gray-900 flex items-center">
              <MapPinIcon className="w-4 h-4 mr-2" />
              Shipping Address
            </h5>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium">{orderData.name}</p>
              <p>{orderData.address}</p>
              <p>
                {orderData.city}, {orderData.state}
              </p>
              <p>
                {orderData.zipCode}, {orderData.country}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Order Items Section Component
  const OrderItemsSection = () => {
    if (!orderData?.cart?.length) return null;

    return (
      <div className="bg-white rounded-lg shadow border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <PackageIcon className="w-5 h-5 mr-2" />
          Order Items ({orderData.cart.length})
        </h3>

        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orderData.cart.map((item: any, index: number) => (
                <tr key={item._id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {item.img && (
                        <Image
                          className="h-10 w-10 rounded-lg object-cover mr-4"
                          src={item.img}
                          alt={item.title}
                          width={40}
                          height={40}
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {item.title}
                        </div>
                        {item.selectedOption && (
                          <div className="text-xs text-gray-500">
                            Option: {item.selectedOption}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.sku || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.orderQuantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    $
                    {((item.price || 0) / (item.orderQuantity || 1)).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${(item.price || 0).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Payment Section Component
  const PaymentSection = () => {
    if (!orderData) return null;

    return (
      <div className="bg-white rounded-lg shadow border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <CreditCardIcon className="w-5 h-5 mr-2" />
          Payment & Pricing
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Payment Information */}
          <div className="space-y-4">
            <h5 className="font-medium text-gray-900">Payment Details</h5>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Payment Method:</span>
                <span className="text-sm font-medium text-gray-900">
                  {orderData.paymentMethod}
                </span>
              </div>
              {orderData.shippingOption && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Shipping Option:
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {orderData.shippingOption}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="space-y-4">
            <h5 className="font-medium text-gray-900">Pricing Breakdown</h5>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Subtotal:</span>
                <span className="text-sm font-medium text-gray-900">
                  ${(orderData.subTotal || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Shipping Cost:</span>
                <span className="text-sm font-medium text-gray-900">
                  ${(orderData.shippingCost || 0).toFixed(2)}
                </span>
              </div>
              {orderData.discount && orderData.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span className="text-sm">Discount:</span>
                  <span className="text-sm font-medium">
                    -${orderData.discount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-base font-semibold text-gray-900">
                    Total Amount:
                  </span>
                  <span className="text-base font-bold text-gray-900">
                    ${(orderData.totalAmount || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Loading order details...</span>
        </div>
      </div>
    );
  }

  // Error State
  if (!isLoading && isError) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <ErrorMsg msg="There was an error loading order details" />
        </div>
      </div>
    );
  }

  // Main Content
  if (!orderData) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Order Header */}
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  Order #{orderData.orderId || orderData.invoice}
                </h1>
                <StatusBadge status={orderData.status || ''} />
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <CalendarIcon className="w-4 h-4" />
                  <span>
                    Placed on{' '}
                    {dayjs(orderData.createdAt).format(
                      'MMMM D, YYYY at h:mm A'
                    )}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>Total: ${(orderData.totalAmount || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="min-w-[200px]">
                <OrderStatusChange id={orderData._id || ''} />
              </div>
              <button
                onClick={handlePrint}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PrintIcon className="w-4 h-4 mr-2" />
                Print Invoice
              </button>
            </div>
          </div>

          {/* Order Notes */}
          {orderData.orderNote && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h4 className="font-medium text-amber-800 mb-2">Order Notes:</h4>
              <p className="text-sm text-amber-700">{orderData.orderNote}</p>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow border">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {[
                { id: 'overview', name: 'Overview', icon: PackageIcon },
                { id: 'items', name: 'Items', icon: PackageIcon },
                { id: 'customer', name: 'Customer', icon: UserIcon },
                { id: 'timeline', name: 'Timeline', icon: CalendarIcon },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <OrderItemsSection />
                  <PaymentSection />
                </div>
                <div className="space-y-6">
                  <CustomerSection />

                  {/* Quick Stats */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <h4 className="font-medium text-gray-900">Order Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Items:</span>
                        <span className="font-medium">
                          {orderData.cart?.length || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Quantity:</span>
                        <span className="font-medium">
                          {orderData.cart?.reduce(
                            (acc: number, item: any) =>
                              acc + (item.orderQuantity || 0),
                            0
                          ) || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Invoice:</span>
                        <span className="font-medium">
                          #{orderData.invoice}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'items' && <OrderItemsSection />}
            {activeTab === 'customer' && <CustomerSection />}
            {activeTab === 'timeline' && (
              <div className="max-w-2xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Order Timeline
                </h3>
                <OrderTimeline />
              </div>
            )}
          </div>
        </div>

        {/* Print Invoice Hidden Section */}
        <div style={{ display: 'none' }}>
          <div ref={printRef} className="p-8 bg-white">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
              <p className="text-gray-600 mt-2">Invoice #{orderData.invoice}</p>
              {orderData.orderId && (
                <p className="text-gray-600">Order ID: {orderData.orderId}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">From:</h3>
                <p className="text-gray-600">
                  East West Off Road
                  <br />
                  Your Business Address
                  <br />
                  City, State, ZIP
                  <br />
                  Phone: Your Phone Number
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">To:</h3>
                <p className="text-gray-600">
                  {orderData.name}
                  <br />
                  {orderData.address}
                  <br />
                  {orderData.city}, {orderData.state}
                  <br />
                  {orderData.zipCode}, {orderData.country}
                  <br />
                  Phone: {orderData.contact}
                </p>
              </div>
            </div>

            <div className="mb-8">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p>
                    <strong>Invoice Date:</strong>{' '}
                    {dayjs(orderData.createdAt).format('MMMM D, YYYY')}
                  </p>
                  <p>
                    <strong>Payment Method:</strong> {orderData.paymentMethod}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Status:</strong> {orderData.status}
                  </p>
                  {orderData.isGuestOrder && (
                    <p>
                      <strong>Customer Type:</strong> Guest
                    </p>
                  )}
                </div>
              </div>
            </div>

            <table className="w-full border-collapse border border-gray-300 mb-8">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Item
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Quantity
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Unit Price
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {orderData.cart?.map((item: any, index: number) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2">
                      {item.title}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {item.orderQuantity}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      $
                      {((item.price || 0) / (item.orderQuantity || 1)).toFixed(
                        2
                      )}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      ${(item.price || 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end">
              <div className="w-64">
                <div className="flex justify-between mb-2">
                  <span>Subtotal:</span>
                  <span>${(orderData.subTotal || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Shipping:</span>
                  <span>${(orderData.shippingCost || 0).toFixed(2)}</span>
                </div>
                {orderData.discount && orderData.discount > 0 && (
                  <div className="flex justify-between mb-2 text-green-600">
                    <span>Discount:</span>
                    <span>-${orderData.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>${(orderData.totalAmount || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
