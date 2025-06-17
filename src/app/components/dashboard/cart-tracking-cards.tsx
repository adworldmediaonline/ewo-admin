'use client';

import { useGetCartTrackingStatsQuery } from '@/redux/cart-tracking/cartTrackingApi';

const CartTrackingCards = () => {
  const { data: stats, isLoading, error } = useGetCartTrackingStatsQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-sm animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
        <p className="text-red-600">Failed to load cart tracking statistics</p>
      </div>
    );
  }

  const cards = [
    {
      title: "Today's Cart Events",
      value: stats?.todayEvents || 0,
      icon: '🛒',
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Weekly Cart Events',
      value: stats?.weekEvents || 0,
      icon: '📈',
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Average Cart Value',
      value: `$${stats?.averageCartValue?.toFixed(2) || '0.00'}`,
      icon: '💰',
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Conversion Rate',
      value: `${stats?.conversionRate?.toFixed(1) || '0.0'}%`,
      icon: '🎯',
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {card.title}
              </p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
            <div
              className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}
            >
              <span className="text-xl">{card.icon}</span>
            </div>
          </div>

          {stats?.topConvertingSource && index === 3 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Top source:{' '}
                <span className="font-medium text-gray-700">
                  {stats.topConvertingSource}
                </span>
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CartTrackingCards;
