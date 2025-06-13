# Shipping Email Notification Feature - Admin Panel

## Overview
The admin panel now includes a comprehensive shipping management feature that allows admins to:
- Ship orders with tracking information
- Send professional email notifications to customers
- Manage shipping status and tracking details

## Features Added

### 1. **New Shipping Column in Orders Table**
- Added "Shipping" column between "Date" and "Actions" columns
- Shows shipping status and actions based on order status
- Displays tracking numbers for shipped orders

### 2. **Shipping Actions Component**
- **For Pending/Processing Orders**: Shows "Ship Order" button
- **For Shipped Orders**: Shows "Shipped" badge with tracking number
- **For Other Statuses**: Shows status information

### 3. **Shipping Modal**
- Professional modal for entering shipping details
- Required carrier selection
- Optional tracking number (can be added later)
- Optional estimated delivery date
- Real-time email notification preview

### 4. **Enhanced Export**
- CSV export now includes shipping information
- Added columns: Shipping Status, Tracking Number, Carrier

## How to Use

### Shipping an Order

1. **Navigate to Orders Page**
   - Go to `/orders` in the admin panel
   - Orders table displays with new "Shipping" column

2. **Ship an Order**
   - Find orders with status "pending" or "processing"
   - Click the blue "Ship Order" button in the Shipping column
   - Fill out the shipping modal:
     - **Carrier**: Required (UPS, FedEx, USPS, DHL, etc.)
     - **Tracking Number**: Optional (from carrier)
     - **Estimated Delivery**: Optional delivery date
   - Click "Ship & Notify Customer"

3. **Automatic Actions**
   - Order status changes to "shipped"
   - Customer receives professional email notification
   - Shipping details saved to order record
   - Table refreshes to show new status

### Email Notification Features

The customer receives a beautifully designed email with:
- **Complete order information** (items, pricing, totals)
- **Shipping address** details
- **Tracking information** (number, carrier, estimated delivery)
- **Direct tracking links** (if tracking number provided)
- **Mobile-responsive design** that works across all email clients

### Managing Shipped Orders

- **View Tracking Info**: Shipped orders show tracking number in table
- **Update Tracking**: Use the backend API to update tracking details
- **Export Data**: CSV export includes all shipping information

## API Integration

The admin panel integrates with these backend endpoints:

- `POST /api/shipping/ship/{orderId}` - Ship order with tracking
- `POST /api/order/send-shipping-notification/{orderId}` - Send notification
- `PATCH /api/order/update-shipping/{orderId}` - Update shipping details

## Technical Implementation

### New Components Added:
- `shipping-modal.tsx` - Modal for shipping order management
- `shipping-actions.tsx` - Action buttons for different order states

### Updated Components:
- `order-table.tsx` - Added shipping column and integration
- `order-table.module.css` - Added shipping column styles

### Redux Integration:
- Added shipping mutations to `orderApi.ts`
- New hooks: `useShipOrderMutation`, `useSendShippingNotificationMutation`

### Type Updates:
- Enhanced `Order` interface with shipping details
- Added shipping-related type definitions

## Order Status Flow

```
Pending/Processing → [Admin Ships] → Shipped → [Email Sent]
```

1. **Pending/Processing**: Shows "Ship Order" button
2. **Admin Action**: Clicks button, fills modal, submits
3. **Shipped**: Status updated, email sent, tracking visible
4. **Customer**: Receives professional shipping notification

## Benefits

### For Admins:
- **Streamlined Process**: One-click shipping with notification
- **Professional Communication**: Beautiful, branded emails
- **Complete Tracking**: Full shipping information management
- **Easy Export**: Enhanced CSV with shipping data

### For Customers:
- **Professional Experience**: Beautiful, mobile-responsive emails
- **Complete Information**: All order and shipping details
- **Direct Tracking**: Links to carrier tracking pages
- **Timely Notifications**: Automatic email when order ships

## Requirements

- Backend API must be running with shipping endpoints
- Email service configured (SMTP settings in backend)
- Redis store configured for cache invalidation

## Support

The shipping feature integrates seamlessly with the existing order management system and requires no additional configuration beyond the backend API setup.
