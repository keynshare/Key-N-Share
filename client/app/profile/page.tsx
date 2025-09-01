import PrivateRoute from '@/lib/Authentication/PrivateRoute'

import React from 'react'
import ProfilePage from '@/components/ProfilePage/ProfilePage'
function page() {
  return (
    <>
    <PrivateRoute>
      <ProfilePage />
    </PrivateRoute>
      </>
  )
}

export default page
