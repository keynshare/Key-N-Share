import PrivateRoute from '@/lib/Authentication/PrivateRoute'
import React from 'react'
import OrdersPage from '@/components/Orders/OrdersPage'

function page() {
  return (
    <PrivateRoute>
      <OrdersPage />
    </PrivateRoute>
  )
}

export default page


