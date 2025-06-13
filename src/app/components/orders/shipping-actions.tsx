'use client';
import React, { useState } from 'react';
import { useShipOrderMutation } from '@/redux/order/orderApi';
import { Order } from '@/types/order-amount-type';
import ShippingModal from './shipping-modal';

interface ShippingActionsProps {
  order: Order;
}

const ShippingActions: React.FC<ShippingActionsProps> = ({ order }) => {
  const [shipOrder] = useShipOrderMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const canShip = order.status === 'pending' || order.status === 'processing';
  const isShipped = order.status === 'shipped';

  const handleShip = async (orderId: string, shippingData: any) => {
    try {
      const result = await shipOrder({
        id: orderId,
        shippingData,
      }).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const ShippingIcon = () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
      />
    </svg>
  );

  const TruckIcon = () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
      />
    </svg>
  );

  if (isShipped) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
          <TruckIcon />
          Shipped
        </div>
        {order.shippingDetails?.trackingNumber && (
          <span className="text-xs text-gray-600 font-mono">
            {order.shippingDetails.trackingNumber}
          </span>
        )}
      </div>
    );
  }

  if (canShip) {
    return (
      <>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
        >
          <ShippingIcon />
          Ship Order
        </button>

        <ShippingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          order={order}
          onShip={handleShip}
        />
      </>
    );
  }

  return (
    <span className="text-xs text-gray-500">Cannot ship ({order.status})</span>
  );
};

export default ShippingActions;
