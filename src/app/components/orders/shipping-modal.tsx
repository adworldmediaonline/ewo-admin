'use client';
import React, { useState } from 'react';
import { useShipOrderMutation } from '@/redux/order/orderApi';
import { Order } from '@/types/order-amount-type';

interface ShippingModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  onShip: (id: string, data: any) => Promise<any>;
}

const ShippingModal: React.FC<ShippingModalProps> = ({
  isOpen,
  onClose,
  order,
  onShip,
}) => {
  const [formData, setFormData] = useState({
    trackingNumber: '',
    carrier: 'UPS',
    estimatedDelivery: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const carriers = [
    'UPS',
    'FedEx',
    'USPS',
    'DHL',
    'Amazon Logistics',
    'Standard Shipping',
    'Express Shipping',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!formData.carrier) {
      setError('Carrier is required');
      return;
    }

    try {
      await onShip(order._id, {
        trackingNumber: formData.trackingNumber || undefined,
        carrier: formData.carrier,
        estimatedDelivery: formData.estimatedDelivery || undefined,
      });

      setSuccess(
        'Order shipped successfully! Customer has been notified via email.'
      );

      setTimeout(() => {
        onClose();
        setFormData({
          trackingNumber: '',
          carrier: 'UPS',
          estimatedDelivery: '',
        });
        setSuccess('');
      }, 2000);
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to ship order');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Ship Order</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
            disabled={isLoading}
          >
            ×
          </button>
        </div>

        {/* Order Info */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Order Details</h3>
          <p className="text-sm text-gray-600">
            Order ID: #{order.orderId || order.invoice}
          </p>
          <p className="text-sm text-gray-600">Customer: {order.name}</p>
          <p className="text-sm text-gray-600">Email: {order.email}</p>
          <p className="text-sm text-gray-600">
            Total: ${order.totalAmount.toFixed(2)}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Carrier */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Carrier <span className="text-red-500">*</span>
            </label>
            <select
              name="carrier"
              value={formData.carrier}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {carriers.map(carrier => (
                <option key={carrier} value={carrier}>
                  {carrier}
                </option>
              ))}
            </select>
          </div>

          {/* Tracking Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tracking Number
            </label>
            <input
              type="text"
              name="trackingNumber"
              value={formData.trackingNumber}
              onChange={handleChange}
              placeholder="Enter tracking number (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Tracking number can be added later if not available yet
            </p>
          </div>

          {/* Estimated Delivery */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Delivery Date
            </label>
            <input
              type="date"
              name="estimatedDelivery"
              value={formData.estimatedDelivery}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Email Notification Info */}
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              📧 A professional shipping notification email will be sent to the
              customer with:
            </p>
            <ul className="text-xs text-blue-700 mt-1 ml-4 list-disc">
              <li>Complete order details and items</li>
              <li>Shipping address and tracking information</li>
              <li>Estimated delivery date</li>
              <li>Direct tracking link (if tracking number provided)</li>
            </ul>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Shipping...' : 'Ship & Notify Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShippingModal;
