"use client";
import { useState, useEffect } from "react";
import { Star } from 'lucide-react'
// import NumberCard from "./NumberCard";
// import PerformanceMatrices from "./PerformanceMatrices";
import { profileApi } from "@/lib/api/ProfileApi";
import { useAuth } from "@/lib/Authentication/AuthContext";
import { useNotifications } from "@/lib/notification-context";

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
  statistics: {
    totalDatasets: number;
    totalSold: number;
    totalEarnings: number;
    profileViews: number;
  };
}

export default function ProfileStatistics() {
  const [activeTab, setActiveTab] = useState("about");
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const { token, isInitialized } = useAuth();
  const { reportError } = useNotifications();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await profileApi.getCurrentUserProfile(token);
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
  }, [token, isInitialized, reportError]);

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

  // Calculate rating percentages
  const getRatingPercentages = () => {
    if (!profile || !profile.sellerRating || profile.sellerRating.numberOfRatings === 0) {
      return [
        { star: 5, percent: 0 },
        { star: 4, percent: 0 },
        { star: 3, percent: 0 },
        { star: 2, percent: 0 },
        { star: 1, percent: 0 }
      ];
    }

    // Placeholder data for ratings
    return [
      { star: 5, percent: 40 },
      { star: 4, percent: 30 },
      { star: 3, percent: 15 },
      { star: 2, percent: 10 },
      { star: 1, percent: 5 }
    ];
  };

  // Generate account overview data
  // const getAccountOverview = () => {
  //   if (!profile) {
  //     return [
  //       { Num: 0, Title: 'Uploaded Datasets' },
  //       { Num: 0, Title: 'Datasets Sold' },
  //       { Num: 0, Title: 'Profile Views' },
  //       { Num: 0, Title: 'Dispute Raised' },
  //       { Num: 0, Title: 'Dispute Solved' }
  //     ];
  //   }

  //   return [
  //     { Num: profile.statistics?.totalDatasets || 0, Title: 'Uploaded Datasets' },
  //     { Num: profile.statistics?.totalSold || 0, Title: 'Datasets Sold' },
  //     { Num: profile.profileViewsCount || 0, Title: 'Profile Views' },
  //     { Num: 0, Title: 'Dispute Raised' }, // Placeholder, add real data when available
  //     { Num: 0, Title: 'Dispute Solved' }  // Placeholder, add real data when available
  //   ];
  // };

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
        <div className="mt-6 space-y-6">
          {/* Bio */}
          <div>
            <h2 className="text-xl font-semibold font-bricola">Bio</h2>
            {loading ? (
              <div className="animate-pulse mt-2">
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ) : (
              <p className="text-gray-700 dark:text-gray-300 mt-2 leading-relaxed line-clamp-6">
                {profile?.bio || 'No bio available.'}
              </p>
            )}
          </div>

          {/* Reputation */}
          <div>
            <h2 className="text-xl font-semibold font-bricola">Reputation</h2>

            {/* Rating */}
            <div className="flex flex-col items-start gap-2 mt-2">
              <span className="text-4xl font-bold">
                {loading ? (
                  <div className="h-10 w-16 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  profile?.sellerRating?.averageRating?.toFixed(1) || '0.0'
                )}
              </span>
              <div className="flex text-orange-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    size={18} 
                    fill={star <= Math.round(profile?.sellerRating?.averageRating || 0) ? "#fb923c" : "none"} 
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {profile?.sellerRating?.numberOfRatings || 0} reviews
              </span>
            </div>

            {/* Rating Bars */}
            <div className="mt-4 space-y-2">
              {getRatingPercentages().map(
                ({ star, percent }) => (
                  <div key={star} className="flex items-center gap-2 text-sm">
                    <span className="w-4">{star}</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded">
                      <div
                        className="h-2 bg-orange-400 rounded"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                    <span className="w-10 text-right">{percent}%</span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Account Overview */}
          {/* <div className="space-y-3">
            <h2 className="text-xl font-semibold font-bricola">Account Overview</h2>
            
            <div className="flex gap-4 lg:justify-between items-start flex-wrap">
              {loading ? (
                // Loading skeleton
                [...Array(5)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="h-10 w-20 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </div>
                ))
              ) : (
                getAccountOverview().map((item, index) => (
                  <NumberCard key={index} Num={item.Num} Title={item.Title} />
                ))
              )}
            </div>
          </div>

          <PerformanceMatrices /> */}
        </div>
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
