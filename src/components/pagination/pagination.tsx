import React from 'react';
import Image from 'next/image';

import ArrowLeftIcon from '@public/images/arrow-left.svg';
import ArrowRightIcon from '@public/images/arrow-right.svg';

interface PaginationProps {
  currentPage: number;
  onNextClick: () => void;
  onPreviousClick: () => void;
  onPageClick: (page: number) => void;
  hasNext: boolean;
  hasPrevious: boolean;
  totalItems: number;
  itemsPerPage: number;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    onNextClick,
    onPreviousClick,
    onPageClick,
    hasNext,
    hasPrevious,
    totalItems,
    itemsPerPage,
  }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
  
    const getPagesList = () => {
      const pages: (number | string)[] = [];
      const middleRange = 2;
      const startPage = Math.max(2, currentPage - middleRange);
      const endPage = Math.min(totalPages - 1, currentPage + middleRange);
  
      pages.push(1);
  
      if (startPage > 2) {
        pages.push('...');
      }
  
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
  
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
  
      if (totalPages > 1) {
        pages.push(totalPages);
      }
  
      return pages;
    };
  
    const pagesList = getPagesList();
  
    return (
      <div className="flex justify-center items-center w-full mt-4">
        <div className="flex justify-center items-center gap-4">
          {hasPrevious && (
            <button onClick={onPreviousClick} className="pagination-button">
              <Image alt="previous" src={ArrowLeftIcon} />
            </button>
          )}
  
          {pagesList.map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && onPageClick(page)}
              className={`flex justify-center items-center w-[32px] h-[32px] rounded-lg ${
                currentPage === page
                  ? 'bg-gradient-to-r from-[rgb(159,4,13)] to-[rgb(227,6,19)] hover:from-[#B01E0D] hover:to-[#B01E0D] text-white'
                  : 'text-[#6E778C] bg-[#E6E5E5]'
              }`}
              disabled={typeof page !== 'number'}
            >
              {page}
            </button>
          ))}
  
          {hasNext && (
            <button onClick={onNextClick} className="pagination-button">
              <Image alt="next" src={ArrowRightIcon} />
            </button>
          )}
        </div>
      </div>
    );
  };
  
  export default Pagination;
  
