"use client"
import React from 'react'
import Breadcrumb from '@/components/SharedComponents/Breadcrumb/Breadcrumb'
import DatasetData from '@/components/assets/dataset.json'
import CheckOutDatasetCard from '@/components/SharedComponents/DatasetCompo/CheckOutDatasetCard'
import { Star } from 'lucide-react'

function OrdersPage() {
  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Catalogue", href: "/catalogue" },
    { label: "Previous Orders", isActive: true }
  ]

  return (
    <>
      <div className='px-3 md:px-5 mb-5 overflow-x-hidden lg:px-10 xl:px-16 2xl:px-20'>
        <Breadcrumb items={breadcrumbItems} />

        <div className='mt-4 flex flex-col gap-4 pb-10'>
          {DatasetData.slice(0,5).map((data, index) => (
            <div key={index} className='flex gap-3 items-start'>
              <CheckOutDatasetCard Data={data} variant='order' />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default OrdersPage


