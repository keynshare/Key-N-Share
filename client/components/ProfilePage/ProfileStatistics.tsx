"use client";
import { useState, useEffect } from "react";
// import NumberCard from "./NumberCard";
// import PerformanceMatrices from "./PerformanceMatrices";
import AboutSection from "./AboutSection";
import { forceCleanupViewedProfiles } from "@/lib/utils/profileViewUtils";
import UserDatasets from './UserDatasets'

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
  profile: ProfileData | null;
  loading: boolean;
  isCurrentUser: boolean;
}

export default function ProfileStatistics({ userId, profile, loading, isCurrentUser }: ProfileStatisticsProps) {
  const [activeTab, setActiveTab] = useState("about");

  // Effect for periodic cleanup of viewed profiles storage
  useEffect(() => {
    // Run cleanup with 20% probability when component mounts
    // This distributes cleanup across different user sessions
    if (Math.random() < 0.2) {
      // Small delay to not interfere with initial rendering
      const timeoutId = setTimeout(() => {
        forceCleanupViewedProfiles();
      }, 5000); // 5 seconds after mount
      
      return () => clearTimeout(timeoutId);
    }
  }, []);





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
        {/* <button
          onClick={() => setActiveTab("followers")}
          className={`pb-2 font-bricola translate-y-[1px] ${activeTab === "followers" ? "border-b-2 border-orange-500 font-bold " : "text-gray-500"}`}
        >
          Followers
        </button> */}
      </div>

      {/* About Section */}
      <div className={activeTab === "about" ? "block" : "hidden"}>
        <AboutSection profile={profile} loading={loading} isCurrentUser={isCurrentUser} />
      </div>

      {/* Datasets Tab */}
      <div className={activeTab === "datasets" ? "block" : "hidden"}>
        <UserDatasets userId={userId}/>
      </div>

      {/* Followers Tab */}
      {/* {activeTab === "followers" && (
        <div className="mt-6 text-sm text-gray-600">Followers list will be displayed here.</div>
      )} */}
    </div>
  );
}
