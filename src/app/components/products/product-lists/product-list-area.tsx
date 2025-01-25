'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import ProductTableHead from './prd-table-head';
import ProductTableItem from './prd-table-item';
import Pagination from '../../ui/Pagination';
import { Search } from '@/svg';
import ErrorMsg from '../../common/error-msg';
import { useGetAllProductsQuery } from '@/redux/product/productApi';
import usePagination from '@/hooks/use-pagination';
import { IProduct } from '@/types/product';

const ProductListArea = () => {
  const { data: products, isError, isLoading } = useGetAllProductsQuery();
  const paginationData = usePagination<IProduct>(products?.data || [], 8);
  const { currentItems, handlePageClick, pageCount } = paginationData;
  const [searchValue, setSearchValue] = useState<string>('');
  const [selectValue, setSelectValue] = useState<string>('');

  // search field
  const handleSearchProduct = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  // handle select input
  const handleSelectField = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectValue(e.target.value);
  };

  // decide what to render
  let content = null;

  if (isLoading) {
    content = <h2>Loading....</h2>;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && isError && products?.data.length === 0) {
    content = <ErrorMsg msg="No Products Found" />;
  }

  if (!isLoading && !isError && products?.success) {
    let productItems: IProduct[] = [...currentItems].reverse();

    // search field
    if (searchValue) {
      productItems = productItems.filter(p =>
        p.title.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    if (selectValue) {
      productItems = productItems.filter(p => p.status === selectValue);
    }

    content = (
      <>
        <div className="relative mx-8 overflow-x-auto">
          <table className="w-full text-base text-left text-gray-500">
            {/* table head start */}
            <ProductTableHead />
            {/* table head end */}
            <tbody>
              {productItems.map(prd => (
                <ProductTableItem key={prd._id} product={prd} />
              ))}
            </tbody>
          </table>
        </div>

        {/* bottom  */}
        <div className="flex flex-wrap items-center justify-between mx-8">
          <p className="mb-0 text-tiny">
            Showing {currentItems.length} of {products?.data.length}
          </p>
          <div className="flex items-center justify-end py-3 mx-8 pagination">
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
      {/* table start */}
      <div className="py-4 bg-white shadow-xs rounded-t-md rounded-b-md">
        <div className="flex items-center justify-between px-8 py-8 tp-search-box">
          <div className="relative search-input">
            <input
              onChange={handleSearchProduct}
              className="input h-[44px] w-full pl-14"
              type="text"
              placeholder="Search by product name"
            />
            <button className="absolute top-1/2 left-5 translate-y-[-50%] hover:text-theme">
              <Search />
            </button>
          </div>
          <div className="flex justify-end space-x-6">
            <div className="flex items-center mr-3 space-x-3 search-select ">
              <span className="text-tiny inline-block leading-none -translate-y-[2px]">
                Status :{' '}
              </span>
              <select onChange={handleSelectField}>
                <option value="">Status</option>
                <option value="in-stock">In stock</option>
                <option value="out-of-stock">Out of stock</option>
              </select>
            </div>
            <div className="flex product-add-btn ">
              <Link href="/add-product" className="tp-btn">
                Add Product
              </Link>
            </div>
          </div>
        </div>
        {content}
      </div>
      {/* table end */}
    </>
  );
};

export default ProductListArea;
