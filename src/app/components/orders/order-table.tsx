import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import dayjs from 'dayjs';
import Link from 'next/link';
// internal
import OrderActions from './order-actions';
import { Search } from '@/svg';
import ErrorMsg from '../common/error-msg';
import Pagination from '../ui/Pagination';
import OrderStatusChange from './status-change';
import { useGetAllOrdersQuery } from '@/redux/order/orderApi';
import usePagination from '@/hooks/use-pagination';

// Simple icon components for missing SVG icons
const Filter = ({ className }: { className?: string }) => (
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
      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
    />
  </svg>
);

const Export = ({ className }: { className?: string }) => (
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
      d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"
    />
  </svg>
);

const Calendar = ({ className }: { className?: string }) => (
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

const User = ({ className }: { className?: string }) => (
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

const CreditCard = ({ className }: { className?: string }) => (
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

const OrderTable = () => {
  const { data: orders, isError, isLoading, error } = useGetAllOrdersQuery();
  const [searchVal, setSearchVal] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [paymentFilter, setPaymentFilter] = useState<string>('');
  const [customerTypeFilter, setCustomerTypeFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  // Enhanced filtering logic
  const filteredOrders = useMemo(() => {
    if (!orders?.data) return [];

    return orders.data.filter(order => {
      const matchesSearch =
        !searchVal ||
        order.orderId?.toLowerCase().includes(searchVal.toLowerCase()) ||
        order.invoice.toString().includes(searchVal) ||
        order.name.toLowerCase().includes(searchVal.toLowerCase()) ||
        order.email.toLowerCase().includes(searchVal.toLowerCase()) ||
        order.contact.includes(searchVal);

      const matchesStatus =
        !statusFilter ||
        order.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesPayment =
        !paymentFilter ||
        order.paymentMethod.toLowerCase() === paymentFilter.toLowerCase();
      const matchesCustomerType =
        !customerTypeFilter ||
        (customerTypeFilter === 'guest' && order.isGuestOrder) ||
        (customerTypeFilter === 'registered' && !order.isGuestOrder);

      const matchesDate =
        !dateFilter ||
        (() => {
          const orderDate = dayjs(order.createdAt);
          switch (dateFilter) {
            case 'today':
              return orderDate.isToday();
            case 'yesterday':
              return orderDate.isYesterday();
            case 'week':
              return orderDate.isAfter(dayjs().subtract(7, 'days'));
            case 'month':
              return orderDate.isAfter(dayjs().subtract(30, 'days'));
            default:
              return true;
          }
        })();

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPayment &&
        matchesCustomerType &&
        matchesDate
      );
    });
  }, [
    orders?.data,
    searchVal,
    statusFilter,
    paymentFilter,
    customerTypeFilter,
    dateFilter,
  ]);

  const paginationData = usePagination(filteredOrders, 10);
  const { currentItems, handlePageClick, pageCount } = paginationData;

  // Handle bulk selection
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(currentItems.map(order => order._id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders(prev => [...prev, orderId]);
    } else {
      setSelectedOrders(prev => prev.filter(id => id !== orderId));
    }
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const getStatusStyles = (status: string) => {
      switch (status.toLowerCase()) {
        case 'pending':
          return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'processing':
          return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'delivered':
          return 'bg-green-100 text-green-800 border-green-200';
        case 'cancel':
          return 'bg-red-100 text-red-800 border-red-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles(
          status
        )}`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
            status === 'pending'
              ? 'bg-yellow-400'
              : status === 'processing'
              ? 'bg-blue-400'
              : status === 'delivered'
              ? 'bg-green-400'
              : 'bg-red-400'
          }`}
        ></span>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Customer info component
  const CustomerInfo = ({ order }: { order: any }) => (
    <div className="flex items-center space-x-3">
      <div className="flex-shrink-0">
        {order.user?.imageURL ? (
          <Image
            className="w-10 h-10 rounded-full object-cover"
            src={order.user.imageURL}
            alt="customer"
            width={40}
            height={40}
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <User />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900 truncate">
          {order.isGuestOrder ? order.name : order.user?.name || order.name}
        </p>
        <p className="text-sm text-gray-500 truncate">{order.email}</p>
        {order.isGuestOrder && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
            Guest
          </span>
        )}
      </div>
    </div>
  );

  // Payment method badge
  const PaymentBadge = ({ method }: { method: string }) => (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
      <CreditCard className="w-3 h-3 mr-1" />
      {method}
    </span>
  );

  // Export functionality
  const handleExport = () => {
    const csvContent = [
      [
        'Order ID',
        'Invoice',
        'Customer',
        'Email',
        'Total',
        'Status',
        'Payment Method',
        'Date',
      ].join(','),
      ...filteredOrders.map(order =>
        [
          order.orderId || '',
          order.invoice,
          order.name,
          order.email,
          order.totalAmount,
          order.status,
          order.paymentMethod,
          dayjs(order.createdAt).format('YYYY-MM-DD HH:mm'),
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${dayjs().format('YYYY-MM-DD')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // decide what to render
  let content = null;

  if (isLoading) {
    content = (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme"></div>
        <span className="ml-2 text-gray-600">Loading orders...</span>
      </div>
    );
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error loading orders" />;
  }
  if (!isLoading && !isError && orders?.data.length === 0) {
    content = <ErrorMsg msg="No Orders Found" />;
  }

  if (
    !isLoading &&
    !isError &&
    orders?.success &&
    filteredOrders.length === 0 &&
    orders.data.length > 0
  ) {
    content = (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-2">
          No orders match your filters
        </div>
        <button
          onClick={() => {
            setSearchVal('');
            setStatusFilter('');
            setPaymentFilter('');
            setCustomerTypeFilter('');
            setDateFilter('');
          }}
          className="text-theme hover:text-theme-dark"
        >
          Clear all filters
        </button>
      </div>
    );
  }

  if (!isLoading && !isError && orders?.success && currentItems.length > 0) {
    content = (
      <>
        {/* Desktop Table View */}
        <div className="hidden lg:block">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left w-12">
                    <input
                      type="checkbox"
                      checked={selectedOrders.length === currentItems.length}
                      onChange={e => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Info
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items & Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map(order => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order._id)}
                        onChange={e =>
                          handleSelectOrder(order._id, e.target.checked)
                        }
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.orderId
                            ? `#${order.orderId}`
                            : `#${order.invoice}`}
                        </div>
                        <div className="text-sm text-gray-500">
                          Invoice: {order.invoice}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <CustomerInfo order={order} />
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.cart.reduce(
                            (acc, curr) => acc + curr.orderQuantity,
                            0
                          )}{' '}
                          items
                        </div>
                        <div className="text-sm text-gray-500">
                          ${order.totalAmount.toFixed(2)}
                        </div>
                        {order.discount && order.discount > 0 && (
                          <div className="text-xs text-green-600">
                            Discount: -${order.discount.toFixed(2)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <PaymentBadge method={order.paymentMethod} />
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-2">
                        <StatusBadge status={order.status} />
                        <div className="w-full max-w-[140px]">
                          <OrderStatusChange id={order._id} />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      <div>{dayjs(order.createdAt).format('MMM D, YYYY')}</div>
                      <div className="text-xs">
                        {dayjs(order.createdAt).format('h:mm A')}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/order-details/${order._id}`}
                          className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
                        >
                          View
                        </Link>
                        <OrderActions
                          id={order._id}
                          cls="inline-flex"
                          inline={true}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {currentItems.map(order => (
            <div
              key={order._id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order._id)}
                    onChange={e =>
                      handleSelectOrder(order._id, e.target.checked)
                    }
                    className="rounded border-gray-300"
                  />
                  <div className="text-sm font-medium text-gray-900">
                    {order.orderId ? `#${order.orderId}` : `#${order.invoice}`}
                  </div>
                </div>
                <StatusBadge status={order.status} />
              </div>

              <CustomerInfo order={order} />

              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Items:</span>
                  <span className="ml-1 font-medium">
                    {order.cart.reduce(
                      (acc, curr) => acc + curr.orderQuantity,
                      0
                    )}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Total:</span>
                  <span className="ml-1 font-medium">
                    ${order.totalAmount.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Payment:</span>
                  <span className="ml-1">{order.paymentMethod}</span>
                </div>
                <div>
                  <span className="text-gray-500">Date:</span>
                  <span className="ml-1">
                    {dayjs(order.createdAt).format('MMM D')}
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="w-full">
                  <OrderStatusChange id={order._id} />
                </div>
                <div className="flex items-center justify-between">
                  <Link
                    href={`/order-details/${order._id}`}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    View Details
                  </Link>
                  <OrderActions
                    id={order._id}
                    cls="inline-flex"
                    inline={true}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center flex-wrap mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-700">
            Showing{' '}
            {filteredOrders.length === 0
              ? 0
              : Math.floor((filteredOrders.length - currentItems.length) / 10) *
                  10 +
                1}{' '}
            to{' '}
            {Math.min(
              Math.floor((filteredOrders.length - currentItems.length) / 10) *
                10 +
                currentItems.length,
              filteredOrders.length
            )}{' '}
            of {filteredOrders.length} orders
            {filteredOrders.length !== orders?.data.length && (
              <span className="text-gray-500">
                {' '}
                (filtered from {orders?.data.length} total)
              </span>
            )}
          </p>
          <div className="pagination py-3">
            <Pagination
              handlePageClick={handlePageClick}
              pageCount={pageCount}
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Enhanced Search and Filter Bar */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <input
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              type="text"
              placeholder="Search by order ID, customer name, email, or phone..."
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4">
              <Search />
            </div>
          </div>

          {/* Filter Toggle and Export */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                showFilters
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {(statusFilter ||
                paymentFilter ||
                customerTypeFilter ||
                dateFilter) && (
                <span className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {
                    [
                      statusFilter,
                      paymentFilter,
                      customerTypeFilter,
                      dateFilter,
                    ].filter(Boolean).length
                  }
                </span>
              )}
            </button>

            <button
              onClick={handleExport}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Export className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="delivered">Delivered</option>
                <option value="cancel">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method
              </label>
              <select
                value={paymentFilter}
                onChange={e => setPaymentFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Methods</option>
                <option value="card">Card</option>
                <option value="cash">Cash</option>
                <option value="stripe">Stripe</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Type
              </label>
              <select
                value={customerTypeFilter}
                onChange={e => setCustomerTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Customers</option>
                <option value="registered">Registered</option>
                <option value="guest">Guest</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Range
              </label>
              <select
                value={dateFilter}
                onChange={e => setDateFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Time</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>
          </div>
        )}

        {/* Bulk Actions */}
        {selectedOrders.length > 0 && (
          <div className="mt-4 flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
            <span className="text-sm font-medium text-blue-800">
              {selectedOrders.length} order
              {selectedOrders.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 text-sm font-medium text-blue-800 hover:text-blue-900 transition-colors">
                Update Status
              </button>
              <button className="px-3 py-1 text-sm font-medium text-blue-800 hover:text-blue-900 transition-colors">
                Export Selected
              </button>
              <button
                onClick={() => setSelectedOrders([])}
                className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table Content */}
      <div className="p-6">{content}</div>
    </div>
  );
};

export default OrderTable;
