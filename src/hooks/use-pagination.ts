import { useState } from 'react';

type PaginationResult<T> = {
  currentItems: T[];
  pageCount: number;
  handlePageClick: (event: { selected: number }) => void;
  forcePage: (page: number) => void;
};

function usePagination<T>(
  items: T[],
  itemsPerPage: number
): PaginationResult<T> {
  const [itemOffset, setItemOffset] = useState(0);

  // Ensure itemOffset is always valid
  const validItemOffset = Math.min(itemOffset, Math.max(0, items.length - 1));

  // Calculate endOffset and ensure it doesn't exceed array bounds
  const endOffset = Math.min(validItemOffset + itemsPerPage, items.length);

  // Get current page items
  const currentItems = items.slice(validItemOffset, endOffset);

  // Calculate total pages
  const pageCount = Math.max(1, Math.ceil(items.length / itemsPerPage));

  const handlePageClick = (event: { selected: number }) => {
    const newOffset = Math.min(
      event.selected * itemsPerPage,
      Math.max(0, items.length - itemsPerPage)
    );
    setItemOffset(newOffset);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const forcePage = (page: number) => {
    const newOffset = Math.min(
      page * itemsPerPage,
      Math.max(0, items.length - itemsPerPage)
    );
    setItemOffset(newOffset);
  };

  return {
    currentItems,
    pageCount,
    handlePageClick,
    forcePage,
  };
}

export default usePagination;
