import React from 'react'
import UserInfo from './UserInfo'
import ProfileStatistics from './ProfileStatistics'
function ProfilePage() {
  return (
   <>
   
   <div className='px-3 md:px-5 mb-5 lg:px-10 xl:px-16 2xl:px-20'>
     <UserInfo/>
     <ProfileStatistics/>
   </div>
   
   </>
  )
}

export default ProfilePage
