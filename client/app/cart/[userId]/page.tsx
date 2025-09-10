
"use client"
import React from 'react'
import PrivateRoute from '@/lib/Authentication/PrivateRoute'
import CartPage from '@/components/CartPage/CartPage'
import { useParams } from 'next/navigation'

function Page() {
     const { userId } = useParams<{ userId: string }>();
  return (
    <>
    <PrivateRoute>
      <CartPage userId={userId} />
    </PrivateRoute>
      </>
  )
}

export default Page
