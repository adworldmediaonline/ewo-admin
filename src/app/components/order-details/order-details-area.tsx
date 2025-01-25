'use client';
import dayjs from 'dayjs';
import React, { useRef } from 'react';
import ErrorMsg from '../common/error-msg';
import { Card, Typography } from '@material-tailwind/react';
import { useGetSingleOrderQuery } from '@/redux/order/orderApi';
import { Invoice } from '@/svg';
import { useReactToPrint } from 'react-to-print';
import { notifyError } from '@/utils/toast';

const OrderDetailsArea = ({ id }: { id: string }) => {
  const { data: orderData, isLoading, isError } = useGetSingleOrderQuery(id);
  const printRef = useRef<HTMLDivElement | null>(null);

  // decide what to render
  let content = null;

  if (isLoading) {
    content = <h2>Loading....</h2>;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }

  if (!isLoading && !isError && orderData) {
    const TABLE_HEAD = [
      'SL',
      'Product Name',
      '	Quantity',
      'Item Price',
      'Amount',
    ];
    const total = orderData.cart.reduce((acc, curr) => acc + curr.price, 0);
    const grand_total = (total +
      orderData.shippingCost +
      (orderData.discount ?? 0)) as number;
    content = (
      <>
        <div className="container grid px-6 mx-auto">
          <h1 className="my-6 text-lg font-bold text-gray-700 dark:text-gray-300">
            Invoice
          </h1>
          <div
            ref={printRef}
            className="p-6 mb-4 overflow-hidden bg-white shadow-sm lg:p-8 rounded-xl"
          >
            <div className=" mb-7">
              <div className="flex flex-col justify-between pb-4 border-b lg:flex-row md:flex-row lg:items-center border-slate-200">
                <h1 className="text-xl font-bold uppercase font-heading">
                  Invoice
                  <p className="mt-1 text-base text-gray-500">
                    Status
                    <span className="pl-2 text-base font-medium capitalize">
                      {' '}
                      <span className="font-heading">
                        <span className="inline-flex px-2 text-base font-medium leading-5 rounded-full">
                          {orderData.status}
                        </span>
                      </span>
                    </span>
                  </p>
                </h1>
                <div className="text-left lg:text-right">
                  <h2 className="mt-4 text-lg font-semibold lg:flex lg:justify-end lg:mt-0 lg:ml-0 md:mt-0">
                    {/* <img
                      src="/static/media/logo-dark.acf69e90.svg"
                      alt="dashtar"
                      width="110"
                    /> */}
                  </h2>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                    Dhaka, Bangladesh
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-between pt-4 lg:flex-row md:flex-row">
                <div className="flex flex-col mb-3 md:mb-0 lg:mb-0">
                  <span className="block text-base font-bold uppercase">
                    DATE
                  </span>
                  <span className="block text-base">
                    <span>
                      {dayjs(orderData.createdAt).format('MMMM D, YYYY')}
                    </span>
                  </span>
                </div>
                <div className="flex flex-col mb-3 md:mb-0 lg:mb-0">
                  <span className="block text-base font-bold uppercase">
                    INVOICE NO
                  </span>
                  <span className="block text-base">#{orderData.invoice}</span>
                </div>
                <div className="flex flex-col text-left lg:text-right">
                  <span className="block text-base font-bold uppercase">
                    INVOICE TO
                  </span>
                  <span className="block text-base text-gray-500">
                    {orderData?.user?.name} <br />
                    <span className="ml-2">{orderData.contact}</span>
                    <br />
                    {orderData.address}
                    <br />
                    {orderData.city}
                  </span>
                </div>
              </div>
            </div>
            <div className="mb-12">
              <div className="relative bg-white rounded-b-md">
                <div className="w-full overflow-x-auto">
                  <table className="w-full text-base text-left text-gray-500 whitespace-no-wrap">
                    <thead className="bg-white">
                      <tr className="border-b border-gray6 text-tiny">
                        <td className="py-3 pl-3 font-semibold uppercase text-tiny text-textBody">
                          SR.
                        </td>
                        <td className="py-3 pr-8 font-semibold uppercase text-tiny text-textBody">
                          Product Title
                        </td>
                        <td className="py-3 pr-8 font-semibold text-center uppercase text-tiny text-textBody">
                          QUANTITY
                        </td>
                        <td className="py-3 pr-3 font-semibold text-center uppercase text-tiny text-textBody">
                          ITEM PRICE
                        </td>
                        <td className="py-3 pr-3 font-semibold text-right uppercase text-tiny text-textBody">
                          AMOUNT
                        </td>
                      </tr>
                    </thead>
                    <tbody className="text-base bg-white divide-y ">
                      {orderData.cart.map((item, i) => (
                        <tr key={item._id} className="">
                          <td className="px-3 py-3 bg-white border-b border-gray6 text-start">
                            {i + 1}
                          </td>
                          <td className="px-3 py-3 pl-0 bg-white border-b border-gray6 text-start">
                            {item.title}
                          </td>
                          <td className="px-3 py-3 font-bold text-center bg-white border-b border-gray6">
                            {item.orderQuantity}
                          </td>
                          <td className="px-3 py-3 font-bold text-center bg-white border-b border-gray6">
                            ${item.price.toFixed(2)}
                          </td>
                          <td className="px-3 py-3 font-bold text-right bg-white border-b border-gray6">
                            ${(item.price * item.orderQuantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="p-8 py-6 border border-slate-200 rounded-xl">
              <div className="flex flex-col justify-between lg:flex-row md:flex-row">
                <div className="flex flex-col mb-3 md:mb-0 lg:mb-0 sm:flex-wrap">
                  <span className="block mb-1 text-base font-bold uppercase">
                    PAYMENT METHOD
                  </span>
                  <span className="block text-base font-semibold">
                    {orderData.paymentMethod}
                  </span>
                </div>
                <div className="flex flex-col mb-3 md:mb-0 lg:mb-0 sm:flex-wrap">
                  <span className="block mb-1 text-base font-bold uppercase">
                    SHIPPING COST
                  </span>
                  <span className="block text-base font-semibold font-heading">
                    ${orderData.shippingCost}
                  </span>
                </div>
                <div className="flex flex-col mb-3 md:mb-0 lg:mb-0 sm:flex-wrap">
                  <span className="block mb-1 text-base font-bold uppercase font-heading">
                    DISCOUNT
                  </span>
                  <span className="block text-base font-semibold text-gray-500 font-heading">
                    ${orderData?.discount}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-wrap">
                  <span className="block mb-1 text-base font-bold uppercase">
                    TOTAL AMOUNT
                  </span>
                  <span className="block text-xl font-bold">
                    ${grand_total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const handlePrint = useReactToPrint({
    content: () => printRef?.current,
    documentTitle: 'Receipt',
  });

  const handlePrintReceipt = async () => {
    try {
      handlePrint();
    } catch (err) {
      console.log('order by user id error', err);
      notifyError('Failed to print');
    }
    // console.log('id', id);
  };

  return (
    <>
      <div className="">{content}</div>
      <div className="container grid px-6 mx-auto">
        <div className="flex justify-between mt-3 mb-4">
          <button onClick={handlePrintReceipt} className="px-5 py-2 tp-btn">
            Print Invoice
            <span className="ml-2">
              <Invoice />
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsArea;
