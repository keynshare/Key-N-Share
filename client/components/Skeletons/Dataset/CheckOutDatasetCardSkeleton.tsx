"use client";
import React from 'react';

const CheckOutDatasetCardSkeleton = () => {
  return (
    <div className='flex flex-col max-w-[300px]  lg:max-w-max 2xl:max-w-[1400px] lg:flex-row gap-2 items-center justify-center p-3 shadow-[1px_1px_17px_0_rgba(0,0,0,0.10)] bg-white dark:bg-[#131313] rounded-lg animate-pulse'>
      <div className='object-cover border border-gray-100 dark:border-gray-600 rounded-md w-full lg:min-w-[300px] lg:max-w-[300px] aspect-video bg-gray-300 dark:bg-gray-700' />

      <div className="w-full">
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-md w-3/4 mb-2" />
        <div className='space-y-2 mb-3'>
          <div className='h-4 bg-gray-300 dark:bg-gray-700 rounded w-full' />
          <div className='h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3' />
        </div>

        <div className="flex flex-wrap items-center my-1 gap-4 text-sm text-gray-500">
          <div className='h-3 bg-gray-300 dark:bg-gray-700 rounded w-24' />
          <div className='h-3 bg-gray-300 dark:bg-gray-700 rounded w-1' />
          <div className='h-3 bg-gray-300 dark:bg-gray-700 rounded w-16' />
          <div className='h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded' />
        </div>

        <div className="flex flex-wrap justify-between items-center gap-4 mt-3">
          <div className="flex items-center gap-2">
            <div className='h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full' />
            <div className='h-10 w-24 bg-gray-300 dark:bg-gray-700 rounded' />
          </div>
          <div className='flex flex-col lg:flex-row lg:w-fit w-full gap-2 justify-center'>
            <div className='h-10 w-36 bg-gray-300 dark:bg-gray-700 rounded' />
            <div className='h-10 w-36 bg-gray-300 dark:bg-gray-700 rounded' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOutDatasetCardSkeleton;


