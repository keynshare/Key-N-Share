
import Authentication from "@/components/Authentication/Authentication"
import PrivateRoute from "@/lib/Authentication/PrivateRoute"
function page() {
  return (
    <>
      <PrivateRoute>
        <Authentication/>
      </PrivateRoute>
    </>
  )
}

export default page
