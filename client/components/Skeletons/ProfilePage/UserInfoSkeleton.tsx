

function UserInfoSkeleton() {
  return (
   <div className="w-full rounded-xl mt-4 shadow-md border dark:border-gray-600 overflow-hidden">
        <div className="animate-pulse">
          <div className="h-40 md:h-72 bg-gray-200 rounded"></div>
          <div className="p-4 md:p-6">
            <div className="h-32 w-32 bg-gray-200 rounded-full mb-4"></div>
            <div className="h-6 w-40 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-60 bg-gray-200 rounded mb-1"></div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
  )
}

export default UserInfoSkeleton
