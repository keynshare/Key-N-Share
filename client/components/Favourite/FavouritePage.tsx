"use client"
import React,{ useState, useEffect,useMemo } from 'react'
import CheckOutDatasetCard from '../SharedComponents/DatasetCompo/CheckOutDatasetCard'
import DatasetData from '@/components/assets/dataset.json'
import Breadcrumb from '../SharedComponents/Breadcrumb/Breadcrumb'
import CardsWithCategory from '../Dashboard/CardsWithCategory'


function FavouritePage() {
    const categories = ["Trending"];


const breadcrumbItems = [
    { label: "Catalogue", href: "/catalogue" },
    { label: "Favourite", isActive: true }
];

  return (
    <>
      <div className=' px-3 md:px-5 mb-5 lg:px-10 xl:px-16 2xl:px-20'>  
        <Breadcrumb items={breadcrumbItems} />
        <div className='flex lg:flex-col pb-10 md:flex-row mt-4 flex-wrap gap-5 items-center justify-center w-full '>
            {
                DatasetData.map((data,index)=>(
                       <React.Fragment key={index}>
                         <CheckOutDatasetCard Data={data} />
                       </React.Fragment>
                ))


            }

        </div>
        <div className='flex items-center 2xl:justify-center w-full'>
        <CardsWithCategory categories={["Trending"]} Data={DatasetData}/>
        </div>
        </div> 

    </>
  )
}

export default FavouritePage
