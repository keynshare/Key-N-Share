import UploadDataset from '@/public/UploadDataset'
import PrivateRoute from '@/lib/Authentication/PrivateRoute'
function page() {
  return (
    <PrivateRoute>
      <UploadDataset/>
    </PrivateRoute>
  )
}

export default page
