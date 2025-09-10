"use client"
import PrivateRoute from '@/lib/Authentication/PrivateRoute'
import React from 'react'
import CartPage from '@/components/CartPage/CartPage'
import {useAuth} from '@/lib/Authentication/AuthContext'
function Page() {
  const { userId } = useAuth();
  return (
    <PrivateRoute>
      <CartPage userId={userId || undefined} />
    </PrivateRoute>
  )
}

export default Page
