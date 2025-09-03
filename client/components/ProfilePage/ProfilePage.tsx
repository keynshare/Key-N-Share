import React from 'react'
import UserInfo from './UserInfo'
import ProfileStatistics from './ProfileStatistics'
import Breadcrumb from '../SharedComponents/Breadcrumb/Breadcrumb'

interface ProfilePageProps {
  userId?: string;
}

function ProfilePage({ userId }: ProfilePageProps) {
  const breadcrumbItems = [
    { label: "Profile", isActive: true }
];

  return (
   <>
   

   <div className='px-3 md:px-5 mb-5 lg:px-10 xl:px-16 2xl:px-20'>
    <Breadcrumb items={breadcrumbItems} />
     <UserInfo userId={userId} />
     <ProfileStatistics userId={userId} />
   </div>
   
   </>
  )
}

export default ProfilePage
