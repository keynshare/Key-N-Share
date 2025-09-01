"use client"
import React from 'react'
import SecondaryBtn from '../SharedComponents/Btns/SecondaryBtn'
import User from '@/components/assets/User.svg'
import CoverProfile from '@/components/assets/CoverProfile.svg'
import Image from 'next/image'
import { useAuth } from '@/lib/Authentication/AuthContext'
import { LogOut } from 'lucide-react'

function UserInfo() {
  const { logout } = useAuth()
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
          <h1 className="text-xl font-semibold">Mohammad Khomeni</h1>
          <p className="text-sm text-gray-600">
            Data Scientist · Joined 2 Years Ago
          </p>
          <p className="text-sm text-gray-500 mt-1">24k followers</p>
        </div>

        {/* Edit Profile Button */}
        <div className="w-full md:w-fit flex gap-3">
          <SecondaryBtn className='w-full md:w-fit' >
            Edit Bio
          </SecondaryBtn>
          <SecondaryBtn onClick={logout} Title='Logout' className='p-2  bg-[#131313] dark:border dark:border-gray-800 hover:bg-[#242424] text-white rounded-full' >
            <LogOut size={20}/>
          </SecondaryBtn>
        </div>
      </div>
    </div>
   
   </>
  )
}

export default UserInfo
