"use client";

import { Star } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/lib/Authentication/AuthContext';
import { ratingApi, RatingSummary } from '@/lib/api/RatingApi';

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

interface AboutSectionProps {
  profile: ProfileData | null;
  loading: boolean;
  isCurrentUser: boolean;
}

export default function AboutSection({ profile, loading, isCurrentUser }: AboutSectionProps) {
  const { token } = useAuth();
  const [sellerSummary, setSellerSummary] = useState<RatingSummary | null>(null);
  const [buyerSummary, setBuyerSummary] = useState<RatingSummary | null>(null);
  const [isLoadingRatings, setIsLoadingRatings] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    const fetchSummaries = async () => {
      if (!profile?._id || !token) return;
      try {
        setIsLoadingRatings(true);
        const [seller, buyer] = await Promise.all([
          ratingApi.getUserRatingSummary(profile._id, 'seller', token),
          ratingApi.getUserRatingSummary(profile._id, 'buyer', token)
        ]);
        if (!cancelled) {
          setSellerSummary(seller);
          setBuyerSummary(buyer);
        }
      } catch (e) {
        // silently ignore, UI will fallback to zeros
        if (!cancelled) {
          setSellerSummary(null);
          setBuyerSummary(null);
        }
      } finally {
        if (!cancelled) setIsLoadingRatings(false);
      }
    };
    fetchSummaries();
    return () => { cancelled = true; };
  }, [profile?._id, token]);

  const sellerPercentages = useMemo(() => {
    const dist = sellerSummary?.ratingDistribution;
    if (!dist) return [5,4,3,2,1].map(star => ({ star, percent: 0 }));
    const total = (dist[1] || 0) + (dist[2] || 0) + (dist[3] || 0) + (dist[4] || 0) + (dist[5] || 0);
    if (!total) return [5,4,3,2,1].map(star => ({ star, percent: 0 }));
    return [5,4,3,2,1].map(star => ({ star, percent: Math.round(((dist[star as 1|2|3|4|5] || 0) / total) * 100) }));
  }, [sellerSummary]);

  const buyerPercentages = useMemo(() => {
    const dist = buyerSummary?.ratingDistribution;
    if (!dist) return [5,4,3,2,1].map(star => ({ star, percent: 0 }));
    const total = (dist[1] || 0) + (dist[2] || 0) + (dist[3] || 0) + (dist[4] || 0) + (dist[5] || 0);
    if (!total) return [5,4,3,2,1].map(star => ({ star, percent: 0 }));
    return [5,4,3,2,1].map(star => ({ star, percent: Math.round(((dist[star as 1|2|3|4|5] || 0) / total) * 100) }));
  }, [buyerSummary]);


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
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>

        {/* Seller Rating */}
        <div className="flex flex-col items-start gap-2 mt-2">
          <span className="text-4xl font-bold">
            {loading ? (
              <div className="h-10 w-16 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              profile?.sellerRating?.averageRating?.toFixed(1) || '0.0'
            )}
          </span>
          <div className={`flex ${isCurrentUser ? 'text-orange-400' : 'text-blue-500'}`}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                size={18} 
                fill={star <= Math.round(profile?.sellerRating?.averageRating || 0) ? (isCurrentUser ? "#fb923c" : "#3b82f6") : "none"} 
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {profile?.sellerRating?.numberOfRatings || 0} reviews as seller
          </span>
           {/* Rating Bars */}
        <div className="mt-4 w-full space-y-2">
          {sellerPercentages.map(
            ({ star, percent }) => (
              <div key={star} className="flex items-center gap-2 text-sm">
                <span className="w-4">{star}</span>
                <div className="flex-1 h-2 bg-gray-200 dark:bg-[#1f1f1f] rounded">
                  <div
                    className={`h-2 ${isCurrentUser ? 'bg-orange-400' : 'bg-blue-500'} rounded`}
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
                <span className="w-10 text-right">{percent}%</span>
              </div>
            )
          )}
          
        </div>
        </div>
        {/* Buyer Rating */}
        <div className="flex flex-col items-start gap-2 mt-2">
          <span className="text-4xl font-bold">
            {loading ? (
              <div className="h-10 w-16 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              profile?.buyerRating?.averageRating?.toFixed(1) || '0.0'
            )}
          </span>
          <div className={`flex ${isCurrentUser ? 'text-orange-400' : 'text-blue-500'}`}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                size={18} 
                fill={star <= Math.round(profile?.buyerRating?.averageRating || 0) ? (isCurrentUser ? "#fb923c" : "#3b82f6") : "none"} 
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {profile?.buyerRating?.numberOfRatings || 0} reviews as buyer
          </span>
           {/* Rating Bars */}
        <div className="mt-4 w-full space-y-2">
          {buyerPercentages.map(
            ({ star, percent }) => (
              <div key={star} className="flex items-center gap-2 text-sm">
                <span className="w-4">{star}</span>
                <div className="flex-1 h-2 bg-gray-200 dark:bg-[#1f1f1f] rounded">
                  <div
                    className={`h-2 ${isCurrentUser ? 'bg-orange-400' : 'bg-blue-500'} rounded`}
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
                <span className="w-10 text-right">{percent}%</span>
              </div>
            )
          )}
          
        </div>
        </div>
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
  );
}