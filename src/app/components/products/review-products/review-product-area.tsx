'use client';
import React, { useState } from 'react';
import { useGetReviewProductsQuery } from '@/redux/product/productApi';
import { Search } from '@/svg';
import ErrorMsg from '../../common/error-msg';
import ReviewItem from './review-item';
import Pagination from '../../ui/Pagination';
import usePagination from '@/hooks/use-pagination';
import { IProduct, IReview } from '@/types/product';

const ReviewProductArea = () => {
  const {
    data: reviewProducts,
    isError,
    isLoading,
  } = useGetReviewProductsQuery();
  const [searchValue, setSearchValue] = useState<string>('');
  const [selectValue, setSelectValue] = useState<string>('');
  const paginationData = usePagination<IProduct>(reviewProducts?.data || [], 5);
  const { currentItems, handlePageClick, pageCount } = paginationData;

  // search field
  const handleSearchReview = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  // handle select input
  const handleSelectField = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectValue(e.target.value.slice(0, 1));
  };

  // decide what to render
  let content = null;

  if (isLoading) {
    content = <h2>Loading....</h2>;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && reviewProducts?.data.length === 0) {
    content = <ErrorMsg msg="No Product Found" />;
  }

  if (!isError && reviewProducts?.success) {
    let review_items: IProduct[] = [...currentItems];
    // search field
    if (searchValue) {
      review_items = review_items.filter((p: IProduct) =>
        p.title.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
    if (selectValue) {
      review_items = review_items.filter((product: IProduct) => {
        const averageRating =
          product.reviews && product.reviews?.length > 0
            ? product.reviews.reduce(
                (acc: number, review: IReview) => acc + review.rating,
                0
              ) / product.reviews.length
            : 0;
        return Math.floor(averageRating) === parseInt(selectValue);
      });
    }
    content = (
      <>
        <div className="flex flex-wrap items-center justify-between px-8 py-8 tp-search-box">
          <div className="relative mb-5 mr-3 search-input md:mb-0">
            <input
              onChange={handleSearchReview}
              className="input h-[44px] w-full pl-14"
              type="text"
              placeholder="Search by product name"
            />
            <button className="absolute top-1/2 left-5 translate-y-[-50%] hover:text-theme">
              <Search />
            </button>
          </div>
          <div className="flex flex-wrap sm:justify-end sm:space-x-6">
            <div className="flex items-center mr-3 space-x-3 search-select ">
              <span className="text-tiny inline-block leading-none -translate-y-[2px]">
                Rating :{' '}
              </span>
              <select onChange={handleSelectField}>
                <option value="">All Ratings</option>
                <option value="5">5 Star</option>
                <option value="4">4 Star</option>
                <option value="3">3 Star</option>
                <option value="2">2 Star</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>
        </div>
        <div className="relative mx-8 overflow-x-auto">
          <table className="w-[1400px] 2xl:w-full text-base text-left text-gray-500">
            <thead className="bg-white">
              <tr className="border-b border-gray6 text-tiny">
                <th
                  scope="col"
                  className="py-3 pr-8 font-semibold uppercase text-tiny text-text2"
                >
                  Product
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[250px] text-end"
                >
                  Rating
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[250px] text-end"
                >
                  Date
                </th>

                <th
                  scope="col"
                  className="px-9 py-3 text-tiny text-text2 uppercase  font-semibold w-[12%] text-end"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {review_items.map(item => (
                <ReviewItem key={item._id} item={item} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between mx-8">
          <p className="mb-0 mr-3 text-tiny">
            Showing 1-
            {currentItems.length} of {reviewProducts?.data.length}
          </p>
          <div className="flex items-center justify-end py-3 mr-8 pagination">
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
    <>
      <div className="py-4 bg-white shadow-xs rounded-t-md rounded-b-md">
        {content}
      </div>
    </>
  );
};

export default ReviewProductArea;
