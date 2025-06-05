'use client';
import React, { useState } from 'react';
import { Delete, View } from '@/svg';
import {
  useGetAllCartsQuery,
  useDeleteCartMutation,
  type Cart,
  type CartQueryParams,
} from '@/redux/cart/cartApi';

export default function CartsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState('');
  const [selectedCart, setSelectedCart] = useState<Cart | null>(null);
  const [showModal, setShowModal] = useState(false);

  // RTK Query parameters
  const queryParams: CartQueryParams = {
    page: currentPage,
    limit: 10,
    search: searchTerm,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    isActive: filterActive,
  };

  // RTK Query hooks
  const { data, error, isLoading, refetch } = useGetAllCartsQuery(queryParams);
  const [deleteCart] = useDeleteCartMutation();

  // Debug logging
  console.log('Cart Query Params:', queryParams);
  console.log('API Base URL:', process.env.NEXT_PUBLIC_API_BASE_URL);
  console.log('Cart Data:', data);
  console.log('Cart Error:', error);
  console.log('Is Loading:', isLoading);

  // Debug logging
  console.log('Cart Query Params:', queryParams);
  console.log('API Base URL:', process.env.NEXT_PUBLIC_API_BASE_URL);
  console.log('Cart Data:', data);
  console.log('Cart Error:', error);
  console.log('Is Loading:', isLoading);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleDelete = async (cartId: string) => {
    if (!confirm('Are you sure you want to delete this cart?')) {
      return;
    }

    try {
      await deleteCart(cartId).unwrap();
    } catch (err) {
      alert('Failed to delete cart');
    }
  };

  const handleViewCart = (cart: Cart) => {
    setSelectedCart(cart);
    setShowModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Extract data
  const carts = data?.data || [];
  const totalCarts = data?.pagination?.totalCarts || 0;
  const totalPages = data?.pagination?.totalPages || 1;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Cart Management
        </h1>
        <p className="text-gray-600">
          Manage and view all customer carts ({totalCarts} total)
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <form
          onSubmit={handleSearch}
          className="flex flex-col md:flex-row gap-4"
        >
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={filterActive}
              onChange={e => setFilterActive(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Carts</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {('message' in error && error.message) ||
            'An error occurred while fetching carts'}
        </div>
      )}

      {/* Carts Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expires
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {carts.map(cart => (
                <tr key={cart._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {cart.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {cart.totalItems}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(cart.totalValue)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        cart.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {cart.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(cart.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(cart.expiresAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewCart(cart)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="View Cart Details"
                      >
                        <View />
                      </button>
                      <button
                        onClick={() => handleDelete(cart._id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete Cart"
                      >
                        <Delete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {carts.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No carts found</div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing page {currentPage} of {totalPages} ({totalCarts} total
            carts)
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Cart Details Modal */}
      {showModal && selectedCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Cart Details
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Customer Information
                  </h3>
                  <p>
                    <strong>Email:</strong> {selectedCart.email}
                  </p>
                  <p>
                    <strong>Status:</strong>
                    <span
                      className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        selectedCart.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {selectedCart.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                  <p>
                    <strong>Created:</strong>{' '}
                    {formatDate(selectedCart.createdAt)}
                  </p>
                  <p>
                    <strong>Expires:</strong>{' '}
                    {formatDate(selectedCart.expiresAt)}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Cart Summary</h3>
                  <p>
                    <strong>Total Items:</strong> {selectedCart.totalItems}
                  </p>
                  <p>
                    <strong>Total Value:</strong>{' '}
                    {formatCurrency(selectedCart.totalValue)}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Cart Items</h3>
                <div className="space-y-4">
                  {selectedCart.cartItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                    >
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {item.title}
                        </h4>
                        {item.sku && (
                          <p className="text-sm text-gray-500">
                            SKU: {item.sku}
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          {formatCurrency(item.price)} × {item.orderQuantity} ={' '}
                          {formatCurrency(item.price * item.orderQuantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
