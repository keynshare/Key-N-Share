"use client"
import React from 'react'
import { useParams } from 'next/navigation'
import PrivateRoute from '@/lib/Authentication/PrivateRoute'
import DeliveryPage from '../page';
function Page() {
    const { datasetId } = useParams<{ datasetId: string }>();
  return (
    <PrivateRoute>
      <DeliveryPage Id={datasetId}/>
    </PrivateRoute>
  )
}

export default Page
