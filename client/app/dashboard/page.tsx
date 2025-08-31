import PrivateRoute from '@/lib/Authentication/PrivateRoute'
import React from 'react'
import Dashboard from "@/components/Dashboard/Dashboard"
function page() {
  return (
    <>
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    </>
  )
}

export default page
