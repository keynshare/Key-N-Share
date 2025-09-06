"use client";
import React, { useState, useEffect } from 'react'
import UserInfo from './UserInfo'
import ProfileStatistics from './ProfileStatistics'
import UserDatasets from './UserDatasets'
import Breadcrumb from '../SharedComponents/Breadcrumb/Breadcrumb'
import { useAuth } from '@/lib/Authentication/AuthContext'
import { profileApi } from '@/lib/api/ProfileApi'
import { useNotifications } from '@/lib/notification-context'
import { hasViewedProfile, markProfileAsViewed, forceCleanupViewedProfiles } from '@/lib/utils/profileViewUtils'

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

interface ProfilePageProps {
  userId?: string;
}

function ProfilePage({ userId }: ProfilePageProps) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(true);
  const { token, isInitialized } = useAuth();
  const { reportError } = useNotifications();

  const breadcrumbItems = [
    { label: "Profile", isActive: true }
  ];

  // Effect for periodic cleanup of viewed profiles storage
  useEffect(() => {
    if (Math.random() < 0.2) {
      const timeoutId = setTimeout(() => {
        forceCleanupViewedProfiles();
      }, 5000);
      
      return () => clearTimeout(timeoutId);
    }
  }, []);

  // Centralized profile data fetching
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        let response;
        
        if (userId) {
          // Fetch another user's profile
          response = await profileApi.getUserProfile(userId, token);
          setIsCurrentUser(false);
          
          // Only increment if we haven't viewed this profile before
          if (!hasViewedProfile(userId)) {
            await profileApi.incrementProfileViews(userId, token);
            markProfileAsViewed(userId);
          }
        } else {
          // Fetch current user's profile
          response = await profileApi.getCurrentUserProfile(token);
          setIsCurrentUser(true);
        }
        
        if (response.success) {
          setProfile(response.data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        reportError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    if (isInitialized && token) {
      fetchProfile();
    } else if (isInitialized && !token) {
      setLoading(false);
    }
  }, [token, isInitialized, reportError, userId]);

  // Don't render anything until auth is initialized
  if (!isInitialized) {
    return (
      <div className='px-3 md:px-5 mb-5 lg:px-10 xl:px-16 2xl:px-20'>
        <Breadcrumb items={breadcrumbItems} />
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
   <>
   <div className='px-3 md:px-5 mb-5 lg:px-10 xl:px-16 2xl:px-20'>
    <Breadcrumb items={breadcrumbItems} />
     <UserInfo 
       userId={userId} 
       profile={profile} 
       loading={loading} 
       isCurrentUser={isCurrentUser}
       onProfileUpdate={(updatedProfile) => setProfile(updatedProfile)}
     />
     <ProfileStatistics 
       userId={userId} 
       profile={profile} 
       loading={loading} 
       isCurrentUser={isCurrentUser}
     />
   </div>
   </>
  )
}

export default ProfilePage