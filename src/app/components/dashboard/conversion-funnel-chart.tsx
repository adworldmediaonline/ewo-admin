'use client';

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useGetConversionFunnelQuery } from '@/redux/cart-tracking/cartTrackingApi';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ConversionFunnelChart = () => {
  const {
    data: funnelData,
    isLoading,
    error,
  } = useGetConversionFunnelQuery({ days: 30 });

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !funnelData) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Conversion Funnel
        </h3>
        <div className="text-center py-12">
          <p className="text-gray-500">Failed to load funnel data</p>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: [
      'Add to Cart',
      'Cart Viewed',
      'Checkout Started',
      'Purchase Completed',
    ],
    datasets: [
      {
        label: 'Users',
        data: [
          funnelData.addToCart,
          funnelData.cartViewed,
          funnelData.checkoutStarted,
          funnelData.purchaseCompleted,
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(139, 92, 246)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const value = context.parsed.y;
            const total = funnelData.addToCart;
            const percentage =
              total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
            return `${context.label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Conversion Funnel (30 Days)
        </h3>
        <div className="text-sm text-gray-500">
          Overall Rate: {funnelData.conversionRates.cartToPurchase.toFixed(1)}%
        </div>
      </div>

      <div className="h-64 mb-6">
        <Bar data={chartData} options={options} />
      </div>

      {/* Conversion Rate Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <p className="text-sm text-gray-500">Cart → Checkout</p>
          <p className="text-lg font-semibold text-blue-600">
            {funnelData.conversionRates.cartToCheckout.toFixed(1)}%
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Checkout → Purchase</p>
          <p className="text-lg font-semibold text-green-600">
            {funnelData.conversionRates.checkoutToPurchase.toFixed(1)}%
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Cart → Purchase</p>
          <p className="text-lg font-semibold text-purple-600">
            {funnelData.conversionRates.cartToPurchase.toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConversionFunnelChart;
