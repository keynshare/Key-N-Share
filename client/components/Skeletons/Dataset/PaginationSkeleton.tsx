"use client";
import React from 'react';

const PaginationSkeleton = () => {
  return (
    <div className="flex justify-center items-center space-x-2 py-4">
      {/* Previous button skeleton */}
      <div className="h-10 w-20 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse"></div>
      
      {/* Page numbers skeleton */}
      <div className="flex space-x-2">
        {[1, 2, 3, 4, 5].map((page) => (
          <div
            key={page}
            className={`h-10 w-10 rounded-md animate-pulse ${
              page === 1 
                ? 'bg-orange-300 dark:bg-orange-700' 
                : 'bg-gray-300 dark:bg-gray-700'
            }`}
          ></div>
        ))}
      </div>
      
      {/* Next button skeleton */}
      <div className="h-10 w-20 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse"></div>
    </div>
  );
};

export default PaginationSkeleton;
