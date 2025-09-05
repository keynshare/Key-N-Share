"use client";
import React from 'react';

const DatasetCardSkeleton = () => {
  return (
    <div className="max-w-[280px] rounded-xl min-w-[280px] shadow-md border border-gray-200 dark:border-gray-800 dark:bg-[#131313] bg-white animate-pulse">
      {/* Top Image Skeleton */}
      <div className="relative rounded-t-xl overflow-hidden h-36 w-full bg-gray-300 dark:bg-gray-700">
        <div className="w-full h-full bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse"></div>
      </div>

      <div className="p-4 py-3 flex flex-col gap-1">
        {/* Title Skeleton */}
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-md w-3/4 animate-pulse"></div>

        {/* Description Skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3 animate-pulse"></div>
        </div>

        {/* Upload info Skeleton */}
        <div className="flex items-center space-x-2 mt-2">
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1 animate-pulse"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
        </div>

        {/* Bottom section Skeleton */}
        <div className="flex items-center justify-between pb-1 mt-2">
          <div className="flex items-center space-x-1">
            <div className="h-4 w-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 w-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          
          <div className="h-4 w-12 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-6 w-6 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
        </div>

        {/* Author section Skeleton */}
        <div className="flex gap-3 border-t dark:border-gray-600 items-center pt-2">
          <div className="w-11 h-11 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
          <div className="space-y-1">
            <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-3 w-20 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatasetCardSkeleton;
