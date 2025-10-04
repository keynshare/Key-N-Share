"use client"
import React, { useEffect, useState } from 'react'
import SecondaryBtn from '../SharedComponents/Btns/SecondaryBtn'
import User from '@/components/assets/User.svg'
import CoverProfile from '@/components/assets/CoverProfile.svg'
import Image from 'next/image'
import { useAuth } from '@/lib/Authentication/AuthContext'
import { LogOut,MessageCircleMoreIcon } from 'lucide-react'
import { profileApi } from '@/lib/api/ProfileApi'
import { useNotifications } from '@/lib/notification-context'
import EditProfileDialog from './EditProfileDialog'
import UserInfoSkeleton from '@/components/Skeletons/ProfilePage/UserInfoSkeleton'
import {AxiosError } from 'axios'

interface ProfileData {
  _id: string;
  firstName: string;
  email: string;
  role: string;
  bio: string;
  profileViewsCount: number;
  sellerRating: {
    totalRating: number;
    numberOfRatings: number;
    averageRating: number;
  };
  buyerRating: {
    totalRating: number;
    numberOfRatings: number;
    averageRating: number;
  };
  statistics: {
    totalDatasets: number;
    totalSold: number;
    totalEarnings: number;
    profileViews: number;
  };
  createdAt: string;
}

interface UserInfoProps {
  userId?: string;
  profile: ProfileData | null;
  loading: boolean;
  isCurrentUser: boolean;
  onProfileUpdate: (profile: ProfileData) => void;
}

function UserInfo({ userId, profile, loading, isCurrentUser, onProfileUpdate }: UserInfoProps) {
  const { logout, token, isInitialized } = useAuth()
  const { notify, reportError } = useNotifications()
  const [isEditOpen, setIsEditOpen] = useState(false)


  // Don't render anything until auth is initialized to prevent hydration issues
  if (!isInitialized) {
    return (
      <UserInfoSkeleton/>
    )
  }

  const handleEditBio = () => {
    setIsEditOpen(true)
  }

  async function handleSave(updates: { role?: string; bio?: string }) {
    if (!token) return
    try {
      const response = await profileApi.updateUserProfile(updates, token)
      if (response?.success) {
        onProfileUpdate(response.data)
        notify({ type: 'success', message: 'Profile updated successfully' })
      } else if (response?.message) {
        notify({ type: 'warning', message: response.message })
      }
    } catch (err) {
       const error = err as AxiosError<{ message: string }>
      reportError(error?.response?.data?.message || 'Failed to update profile')
    }
  }

  return (
   <>
    <div className="w-full rounded-xl mt-4 shadow-md border dark:border-gray-600 overflow-hidden">
      {/* Banner */}
      <div className="relative h-40 md:h-72 bg-white dark:bg-[#0e0e0e] border-b dark:border-gray-600 ">
        <Image src={CoverProfile} alt='Profile Cover for Key n Share' className=" object-cover object-right-top h-full w-screen md:h-full "/>
      </div>

      {/* Profile Section */}
      <div className="relative flex flex-col md:flex-row items-start md:justify-between md:items-center gap-1 p-4 md:p-6">
        {/* Profile Image */}
        <div className="absolute -top-36 left-2 md:bottom-10 md:top-auto md:left-6">
          <Image src={User} alt='' className="w-32 h-32 md:w-40 md:h-40 rounded-full border-[3px] border-[#0099ff] object-cover flex items-center justify-center text-gray-400 text-xl"/>
        </div>

        {/* Profile Info */}
        <div className="md:ml-40">
          {loading ? (
            <div className="animate-pulse">
              <div className="h-6 w-40 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-60 bg-gray-200 rounded mb-1"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-semibold">{profile?.firstName || 'User'}</h1>
              <p className="text-sm text-gray-600">
                {profile?.role || 'No Designation '} · Joined {profile ? new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'Recently'}
              </p>
              <p className="text-sm text-gray-500 mt-1">{profile?.profileViewsCount || 0} profile views</p>
            </>
          )}
        </div>

        {/* Edit Profile Button */}
        <div className="w-full md:w-fit flex gap-3">
          {!userId && (
            <SecondaryBtn className='w-full md:w-fit' onClick={handleEditBio}>
              Edit Profile
            </SecondaryBtn>
          )}

          {!userId ? (
            <SecondaryBtn onClick={logout} Title='Logout' className='p-2 bg-[#131313] dark:border dark:border-gray-800 hover:bg-[#242424] text-white ' >
              <LogOut size={20}/>
            </SecondaryBtn>
          ) : (
            // <SecondaryBtn  Title='Chat' className='p-2 bg-[#131313] dark:border dark:border-gray-800 hover:bg-[#242424] text-white ' >
            //   <MessageCircleMoreIcon size={20}/>
            // </SecondaryBtn>
            <></>
          )}

        </div>
      </div>
    </div>

    <EditProfileDialog
        isOpen={isEditOpen}
        currentRole={profile?.role || ""}
        currentBio={profile?.bio || ""}
        onClose={() => setIsEditOpen(false)}
        onSave={handleSave}
      />
   </>
  )
}

export default UserInfo
