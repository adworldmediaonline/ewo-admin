import { apiSlice } from '../api/apiSlice';
import {
  IOrderAmounts,
  ISalesReport,
  IMostSellingCategory,
  IDashboardRecentOrders,
  IGetAllOrdersRes,
  IUpdateStatusOrderRes,
  Order,
} from '@/types/order-amount-type';

export const authApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    // getUserOrders
    getDashboardAmount: builder.query<IOrderAmounts, void>({
      query: () => `/api/user-order/dashboard-amount`,
      providesTags: ['DashboardAmount'],
      keepUnusedDataFor: 600,
    }),
    // get sales report
    getSalesReport: builder.query<ISalesReport, void>({
      query: () => `/api/user-order/sales-report`,
      providesTags: ['DashboardSalesReport'],
      keepUnusedDataFor: 600,
    }),
    // get selling category
    getMostSellingCategory: builder.query<IMostSellingCategory, void>({
      query: () => `/api/user-order/most-selling-category`,
      providesTags: ['DashboardMostSellingCategory'],
      keepUnusedDataFor: 600,
    }),
    // get recent orders
    getRecentOrders: builder.query<IDashboardRecentOrders, void>({
      query: () => `/api/user-order/dashboard-recent-order`,
      providesTags: ['DashboardRecentOrders'],
      keepUnusedDataFor: 600,
    }),
    // get recent orders
    getAllOrders: builder.query<IGetAllOrdersRes, void>({
      query: () => `/api/order/orders`,
      providesTags: ['AllOrders'],
      keepUnusedDataFor: 600,
    }),
    // get recent orders
    getSingleOrder: builder.query<Order, string>({
      query: id => `/api/order/${id}`,
      keepUnusedDataFor: 600,
    }),
    // get recent orders
    updateStatus: builder.mutation<
      IUpdateStatusOrderRes,
      { id: string; status: { status: string } }
    >({
      query({ id, status }) {
        return {
          url: `/api/order/update-status/${id}`,
          method: 'PATCH',
          body: status,
        };
      },
      invalidatesTags: ['AllOrders', 'DashboardRecentOrders'],
    }),
    // ship order with tracking
    shipOrder: builder.mutation<
      any,
      {
        id: string;
        shippingData: {
          trackingNumber?: string;
          carrier: string;
          estimatedDelivery?: string;
        };
      }
    >({
      query({ id, shippingData }) {
        return {
          url: `/api/shipping/ship/${id}`,
          method: 'POST',
          body: shippingData,
        };
      },
      invalidatesTags: ['AllOrders', 'DashboardRecentOrders'],
    }),
    // send shipping notification
    sendShippingNotification: builder.mutation<
      any,
      {
        id: string;
        shippingData: {
          trackingNumber?: string;
          carrier: string;
          estimatedDelivery?: string;
        };
      }
    >({
      query({ id, shippingData }) {
        return {
          url: `/api/order/send-shipping-notification/${id}`,
          method: 'POST',
          body: shippingData,
        };
      },
      invalidatesTags: ['AllOrders', 'DashboardRecentOrders'],
    }),
    // update shipping details
    updateShippingDetails: builder.mutation<
      any,
      {
        id: string;
        shippingData: {
          trackingNumber?: string;
          carrier: string;
          trackingUrl?: string;
          estimatedDelivery?: string;
          sendEmail?: boolean;
        };
      }
    >({
      query({ id, shippingData }) {
        return {
          url: `/api/order/update-shipping/${id}`,
          method: 'PATCH',
          body: shippingData,
        };
      },
      invalidatesTags: ['AllOrders', 'DashboardRecentOrders'],
    }),
  }),
});

export const {
  useGetDashboardAmountQuery,
  useGetSalesReportQuery,
  useGetMostSellingCategoryQuery,
  useGetRecentOrdersQuery,
  useGetAllOrdersQuery,
  useUpdateStatusMutation,
  useGetSingleOrderQuery,
  useShipOrderMutation,
  useSendShippingNotificationMutation,
  useUpdateShippingDetailsMutation,
} = authApi;
