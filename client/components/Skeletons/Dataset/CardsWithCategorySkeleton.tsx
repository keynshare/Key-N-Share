"use client";
import React from 'react';
import DatasetCardSkeleton from '../Dataset/DatasetCardSkeleton';

type CardsWithCategorySkeletonProps = {
  categories: string[];
  cardsPerCategory?: number;
};

const CardsWithCategorySkeleton = ({ 
  categories, 
  cardsPerCategory = 4 
}: CardsWithCategorySkeletonProps) => {
  return (
    <>
      {categories.map((category, index) => (
        <div
          key={index}
          className="flex flex-col w-full overflow-hidden h-fit gap-5 items-start justify-start"
        >
          {/* Category title skeleton */}
          <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse"></div>
          
          {/* Cards skeleton */}
          <div className="flex h-fit w-full overflow-x-auto scrollHidden justify-start gap-4 items-center pb-4">
            {Array.from({ length: cardsPerCategory }).map((_, cardIndex) => (
              <DatasetCardSkeleton key={cardIndex} />
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default CardsWithCategorySkeleton;
