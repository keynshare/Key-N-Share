"use client"
import React from 'react'
import { useParams } from 'next/navigation'
import PrivateRoute from '@/lib/Authentication/PrivateRoute'
import DeliveryPage from '@/components/Delivery/DeliveryPage'
function Page() {
    const { datasetId, orderid } = useParams<{ datasetId: string, orderid: string }>();
    const params :string | number = datasetId ;
  return (
    <PrivateRoute>
      <DeliveryPage Id={params} orderId={orderid}/>
    </PrivateRoute>
  )
}

export default Page
