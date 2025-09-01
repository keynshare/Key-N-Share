import PrivateRoute from '@/lib/Authentication/PrivateRoute'
import React from 'react'
import SpecificDataset from '@/components/SpecificDatasetPage/SpecificDatasetPage'

export default function Page() {
  return (
    <>
      <PrivateRoute>
        <SpecificDataset />
      </PrivateRoute>
    </>
  )
}


