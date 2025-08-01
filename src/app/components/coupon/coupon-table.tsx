import React, { useState } from "react";
import Image from "next/image";
import dayjs from "dayjs";
// internal
import Loading from "../common/loading";
import ErrorMsg from "../common/error-msg";
import CouponAction from "./coupon-action";
import { useGetAllCouponsQuery } from "@/redux/coupon/couponApi";
import Pagination from "../ui/Pagination";
import usePagination from "@/hooks/use-pagination";

// table head
function TableHead({ title }: { title: string }) {
  return (
    <th
      scope="col"
      className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[170px] text-end"
    >
      {title}
    </th>
  );
}

// prop type
type IPropType = {
  cls?: string;
  setOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  selectValue?: string;
  searchValue?: string;
};

const CouponTable = ({cls,setOpenSidebar,selectValue,searchValue}: IPropType) => {
  const { data: coupons, isError, isLoading, error } = useGetAllCouponsQuery();
  const paginationData = usePagination(coupons || [], 5);
  const { currentItems, handlePageClick, pageCount } = paginationData;
  // decide to render
  let content = null;
  if (isLoading) {
    content = <Loading loading={isLoading} spinner="bar" />;
  }
  if (isError && !coupons) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isError && coupons) {
    let coupon_items = [...currentItems];
    // search value filtering if search value true
    if (searchValue) {
      coupon_items = coupon_items.filter((c) =>
        c.title.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
    // selectValue filtering if selectValue true
    if (selectValue) {
      coupon_items = coupon_items.filter(
        (c) => c.status.toLowerCase() === selectValue.toLowerCase()
      );
    }
    content = (
      <>
        <table className="w-full text-base text-left text-gray-500">
          <thead className="bg-white">
            <tr className="border-b border-gray6 text-tiny">
              <th
                scope="col"
                className="pr-8 py-3 text-tiny text-text2 uppercase font-semibold"
              >
                Name
              </th>
              <TableHead title="Code" />
              <TableHead title="Discount" />
              <TableHead title="Usage" />
              <TableHead title="Status" />
              <TableHead title="Start" />
              <TableHead title="End" />
              <th
                scope="col"
                className="px-9 py-3 text-tiny text-text2 uppercase  font-semibold w-[12%] text-end"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {coupon_items.map((coupon) => (
                <tr
                  key={coupon._id}
                  className="bg-white border-b border-gray6 last:border-0 text-start mx-9"
                >
                  <td className="pr-8 py-5 whitespace-nowrap">
                    <div className="flex items-center space-x-5">
                      {coupon?.logo && (
                        <Image
                          className="w-[60px] h-[60px] rounded-md"
                          src={coupon.logo}
                          alt="logo"
                          width={60}
                          height={60}
                        />
                      )}
                      <span className="font-medium text-heading">
                        {coupon.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-black font-normal text-end">
                    <span className="uppercase rounded-md px-3 py-1 bg-gray">
                      {coupon.couponCode}
                    </span>
                  </td>
                  <td className="px-3 py-3 font-normal text-[#55585B] text-end">
                    {coupon.discountType === 'percentage' 
                      ? `${coupon.discountPercentage}%`
                      : coupon.discountType === 'fixed_amount'
                      ? `$${coupon.discountAmount}`
                      : coupon.discountType === 'buy_x_get_y'
                      ? `Buy ${coupon.buyQuantity} Get ${coupon.getQuantity}`
                      : 'Free Shipping'
                    }
                  </td>
                  <td className="px-3 py-3 font-normal text-[#55585B] text-end">
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">
                        {coupon.usageCount || 0}
                      </div>
                      {coupon.usageLimit && (
                        <div className="text-xs text-gray-500">
                          / {coupon.usageLimit}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-3 font-normal text-[#55585B] text-end">
                    <span
                      className={`text-[11px] px-3 py-1 rounded-md leading-none font-medium text-end ${
                        coupon.status === 'expired'
                          ? "text-red-600 bg-red-100"
                          : coupon.status === 'exhausted'
                          ? "text-orange-600 bg-orange-100"
                          : coupon.status === 'inactive'
                          ? "text-gray-600 bg-gray-100"
                          : "text-green-600 bg-green-100"
                      }`}
                    >
                      {coupon.status.charAt(0).toUpperCase() + coupon.status.slice(1)}
                    </span>
                  </td>

                  <td className="px-3 py-3 text-end">
                    {dayjs(coupon.createdAt).format("MMM D, YYYY")}
                  </td>
                  <td className="px-3 py-3 text-end">
                    {dayjs(coupon.endTime).format("MMM D, YYYY")}
                  </td>
                  <td className="px-9 py-3 text-end">
                    <CouponAction
                      id={coupon._id}
                      setOpenSidebar={setOpenSidebar}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

          <div className="flex justify-between items-center flex-wrap mx-8">
            <p className="mb-0 text-tiny">
              Showing 1-
              {
                currentItems.length
              }{" "}
              of {coupons?.length}
            </p>
            <div className="pagination py-3 flex justify-end items-center mx-8 pagination">
              <Pagination
                handlePageClick={handlePageClick}
                pageCount={pageCount}
              />
            </div>
          </div>
      </>
    );
  }
  return (
    <div className={`${cls ? cls : "relative overflow-x-auto mx-8"}`}>
      {content}
    </div>
  );
};

export default CouponTable;
