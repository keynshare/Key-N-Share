"use client";
import { useState, useEffect } from "react";
// import NumberCard from "./NumberCard";
// import PerformanceMatrices from "./PerformanceMatrices";
import { profileApi } from "@/lib/api/ProfileApi";
import { useAuth } from "@/lib/Authentication/AuthContext";
import { useNotifications } from "@/lib/notification-context";
import AboutSection from "./AboutSection";

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
}

interface ProfileStatisticsProps {
  userId?: string; 
}

export default function ProfileStatistics({ userId }: ProfileStatisticsProps = {}) {
  const [activeTab, setActiveTab] = useState("about");
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const { token, isInitialized } = useAuth();
  const { reportError } = useNotifications();
  const [isCurrentUser, setIsCurrentUser] = useState(true);

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

    // Only fetch if auth is initialized
    if (isInitialized && token) {
      fetchProfile();
    } else if (isInitialized && !token) {
      setLoading(false);
    }
  }, [token, isInitialized, reportError, userId]);

  // Don't render anything until auth is initialized to prevent hydration issues
  if (!isInitialized) {
    return (
      <div className="w-full mx-auto mt-8 p-4 rounded-lg shadow-sm">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }



  return (
    <div className="w-full mx-auto mt-8 p-4 rounded-lg shadow-sm">
      {/* Tabs */}
      <div className="flex gap-6 border-b dark:border-gray-800 text-sm font-medium">
        <button
          onClick={() => setActiveTab("about")}
          className={`pb-2 font-bricola translate-y-[1px] ${activeTab === "about" ? "border-b-2 border-orange-500 font-bold" : "text-gray-500"}`}
        >
          About
        </button>
        <button
          onClick={() => setActiveTab("datasets")}
          className={`pb-2 font-bricola translate-y-[1px] ${activeTab === "datasets" ? "border-b-2 border-orange-500 font-bold" : "text-gray-500"}`}
        >
          Datasets
        </button>
        <button
          onClick={() => setActiveTab("followers")}
          className={`pb-2 font-bricola translate-y-[1px] ${activeTab === "followers" ? "border-b-2 border-orange-500 font-bold " : "text-gray-500"}`}
        >
          Followers
        </button>
      </div>

      {/* About Section */}
      {activeTab === "about" && (
        <AboutSection profile={profile} loading={loading} isCurrentUser={isCurrentUser} />

        
      )}

      {/* Datasets Tab */}
      {activeTab === "datasets" && (
        <div className="mt-6">
          {loading ? (
            <div className="text-sm text-gray-600">Loading datasets...</div>
          ) : (
            <div className="text-sm text-gray-600">
              {profile?.statistics?.totalDatasets ? 
                `You have ${profile.statistics.totalDatasets} datasets.` : 
                'No datasets found.'}
            </div>
          )}
        </div>
      )}

      {/* Followers Tab */}
      {activeTab === "followers" && (
        <div className="mt-6 text-sm text-gray-600">Followers list will be displayed here.</div>
      )}
    </div>
  );
}
