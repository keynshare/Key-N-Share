import React from 'react'
import UserInfo from './UserInfo'
import ProfileStatistics from './ProfileStatistics'
import Breadcrumb from '../SharedComponents/Breadcrumb/Breadcrumb'
function ProfilePage() {
  const breadcrumbItems = [
    { label: "Profile", isActive: true }
];

  return (
   <>
   

   <div className='px-3 md:px-5 mb-5 lg:px-10 xl:px-16 2xl:px-20'>
    <Breadcrumb items={breadcrumbItems} />
     <UserInfo/>
     <ProfileStatistics/>
   </div>
   
   </>
  )
}

export default ProfilePage
