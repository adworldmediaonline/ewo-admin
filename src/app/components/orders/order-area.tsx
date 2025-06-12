'use client';
import React from 'react';
import OrderTable from './order-table';

const OrderArea = () => {
  return (
    <div className="space-y-6">
      {/* order table start */}
      <OrderTable />
      {/* order table end */}
    </div>
  );
};

export default OrderArea;
