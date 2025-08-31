import PrivateRoute from '@/lib/Authentication/PrivateRoute'

import React from 'react'
import Catalogue from "@/components/Catalogue/Catalogue"
function page() {
  return (
    <>
      <PrivateRoute>
        <Catalogue />
      </PrivateRoute>
    </>
  )
}

export default page
