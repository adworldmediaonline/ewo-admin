import { apiSlice } from '../api/apiSlice';

export interface CartTrackingEvent {
  _id: string;
  sessionId: string;
  userId?: string;
  userEmail?: string;
  productId: string;
  productTitle: string;
  productCategory: string;
  productBrand: string;
  originalPrice: number;
  markedUpPrice: number;
  finalPrice: number;
  discountPercentage: number;
  quantity: number;
  source: string;
  device: {
    type: 'desktop' | 'mobile' | 'tablet';
    browser: string;
    os: string;
  };
  isFirstTimeUser: boolean;
  eventType:
    | 'add_to_cart'
    | 'cart_viewed'
    | 'checkout_started'
    | 'purchase_completed';
  createdAt: string;
  updatedAt: string;
}

export interface CartAnalyticsData {
  totalEvents: number;
  uniqueUsers: number;
  conversionRate: number;
  topProducts: Array<{
    productId: string;
    productTitle: string;
    productCategory: string;
    eventCount: number;
    totalRevenue: number;
  }>;
  sourceBreakdown: Array<{
    source: string;
    count: number;
    percentage: number;
  }>;
  deviceBreakdown: Array<{
    deviceType: string;
    count: number;
    percentage: number;
  }>;
  hourlyBreakdown: Array<{
    hour: number;
    count: number;
  }>;
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

export interface ConversionFunnelData {
  addToCart: number;
  cartViewed: number;
  checkoutStarted: number;
  purchaseCompleted: number;
  conversionRates: {
    cartToCheckout: number;
    checkoutToPurchase: number;
    cartToPurchase: number;
  };
}

export interface UserJourneyData {
  sessionId: string;
  userId?: string;
  userEmail?: string;
  events: CartTrackingEvent[];
  totalEvents: number;
  conversionStatus: 'converted' | 'abandoned' | 'in_progress';
  sessionDuration: number;
  totalValue: number;
}

export const cartTrackingApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // Get cart analytics overview
    getCartAnalytics: builder.query<
      CartAnalyticsData,
      {
        startDate?: string;
        endDate?: string;
        productId?: string;
        userId?: string;
        source?: string;
        deviceType?: string;
      }
    >({
      query: params => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value) searchParams.append(key, value);
        });
        return `/api/cart-tracking/analytics?${searchParams.toString()}`;
      },
      providesTags: ['CartAnalytics'],
    }),

    // Get conversion funnel data
    getConversionFunnel: builder.query<
      ConversionFunnelData,
      {
        days?: number;
        startDate?: string;
        endDate?: string;
      }
    >({
      query: params => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value) searchParams.append(key, value.toString());
        });
        return `/api/cart-tracking/analytics/conversion-funnel?${searchParams.toString()}`;
      },
      providesTags: ['CartAnalytics'],
    }),

    // Get popular products
    getPopularProducts: builder.query<
      Array<{
        productId: string;
        productTitle: string;
        productCategory: string;
        eventCount: number;
        uniqueUsers: number;
        conversionRate: number;
        totalRevenue: number;
      }>,
      {
        limit?: number;
        days?: number;
      }
    >({
      query: params => {
        const searchParams = new URLSearchParams();
        if (params.limit) searchParams.append('limit', params.limit.toString());
        if (params.days) searchParams.append('days', params.days.toString());
        return `/api/cart-tracking/analytics/popular-products?${searchParams.toString()}`;
      },
      providesTags: ['CartAnalytics'],
    }),

    // Get user cart journey
    getUserCartJourney: builder.query<
      UserJourneyData,
      {
        userId?: string;
        sessionId?: string;
        limit?: number;
        page?: number;
      }
    >({
      query: params => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value) searchParams.append(key, value.toString());
        });
        return `/api/cart-tracking/analytics/user-journey?${searchParams.toString()}`;
      },
      providesTags: ['CartAnalytics'],
    }),

    // Get cart tracking statistics for dashboard cards
    getCartTrackingStats: builder.query<
      {
        todayEvents: number;
        weekEvents: number;
        monthEvents: number;
        totalEvents: number;
        averageCartValue: number;
        topConvertingSource: string;
        conversionRate: number;
      },
      void
    >({
      query: () => '/api/cart-tracking/analytics/stats',
      transformResponse: (response: any) => response.data,
      providesTags: ['CartAnalytics'],
    }),

    // Get all cart tracking events with pagination
    getCartTrackingEvents: builder.query<
      {
        events: CartTrackingEvent[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      },
      {
        page?: number;
        limit?: number;
        startDate?: string;
        endDate?: string;
        productId?: string;
        userId?: string;
        source?: string;
        eventType?: string;
      }
    >({
      query: params => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value) searchParams.append(key, value.toString());
        });
        return `/api/cart-tracking/events?${searchParams.toString()}`;
      },
      transformResponse: (response: any) => response.data,
      providesTags: ['CartTrackingEvents'],
    }),
  }),
});

export const {
  useGetCartAnalyticsQuery,
  useGetConversionFunnelQuery,
  useGetPopularProductsQuery,
  useGetUserCartJourneyQuery,
  useGetCartTrackingEventsQuery,
  useGetCartTrackingStatsQuery,
} = cartTrackingApi;
