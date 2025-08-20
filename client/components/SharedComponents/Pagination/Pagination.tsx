"use client";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 7;
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
     
      pages.push(1);
      
      if (currentPage <= 4) {
        // Show first 5 pages + ellipsis + last 3
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("...");
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 3) {
        // Show first 3 + ellipsis + last 5 pages
        for (let i = 2; i <= 3; i++) {
          pages.push(i);
        }
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show first 2 + ellipsis + current-1, current, current+1 + ellipsis + last 2
        for (let i = 2; i <= 2; i++) {
          pages.push(i);
        }
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        for (let i = totalPages - 1; i <= totalPages; i++) {
          pages.push(i);
        }
      }
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center w-full justify-center gap-2 mt-5">
      {/* Previous button */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-10 h-10 dark:border-gray-800 dark:hover:bg-[#272727] rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Page numbers */}
      {visiblePages.map((page, index) => (
        <React.Fragment key={index}>
          {page === "..." ? (
            <span className="px-3 py-2 text-gray-500">. . . .</span>
          ) : (
            <button
              onClick={() => onPageChange(page as number)}
              className={`flex items-center justify-center text-lg w-10 h-10 rounded-lg border dark:border-gray-800 transition-colors ${
                currentPage === page
                  ? "bg-black dark:bg-gray-100 dark:text-black text-white border-black"
                  : "border-gray-300  bg-white dark:bg-[#131313] dark:hover:bg-gray-900 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      {/* Next button */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center dark:hover:bg-[#272727] w-10 h-10 rounded-lg border dark:border-gray-800 border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default Pagination;
