import PrivateRoute from '@/lib/Authentication/PrivateRoute'

import React from 'react'
import FavouritePage from '@/components/Favourite/FavouritePage'
function page() {
  return (
    <>
      <PrivateRoute>
        <FavouritePage />
      </PrivateRoute>
    </>
  )
}

export default page
