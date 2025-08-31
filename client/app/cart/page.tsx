import PrivateRoute from '@/lib/Authentication/PrivateRoute'
import React from 'react'
import CartPage from '@/components/CartPage/CartPage'

function page() {
  return (
    <PrivateRoute>
      <CartPage />
    </PrivateRoute>
  )
}

export default page
