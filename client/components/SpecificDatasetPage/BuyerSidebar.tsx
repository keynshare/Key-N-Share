import React, { useEffect, useState } from 'react'
import Image from "next/image";
import User from "@/components/assets/User.svg";
import clsx from 'clsx';
import { Star } from "lucide-react";
import { useAuth } from '@/lib/Authentication/AuthContext';
import { userOrdersApi, DatasetBuyersResponse } from '@/lib/api/UserOrdersApi';
import { ratingApi } from '@/lib/api/RatingApi';
import { useNotifications } from '@/lib/notification-context';
import { AxiosError } from 'axios';
type RequestSidebarProps = {
  UploaderId?: string,
  ShowRequest?: boolean,
  
  UserImage?: string,
  
  datasetId?: string,
}

function BuyerSidebar({
  ShowRequest,
  
  UploaderId,
  UserImage = User.src,
  
  datasetId,
}: RequestSidebarProps) {
  // const [hover, setHover] = useState<number | null>(null);
  // const [selected, setSelected] = useState<number>(0);
  const {userId} = useAuth();
  const { token } = useAuth();

  const [buyers, setBuyers] = useState<{ id: string; name: string }[]>([]);
  const [buyerSelectedRating, setBuyerSelectedRating] = useState<Record<string, number>>({});
  const [buyerAverageRating, setBuyerAverageRating] = useState<Record<string, number>>({});
  const [buyerHoverRating, setBuyerHoverRating] = useState<Record<string, number>>({});
  const [submittingBuyer, setSubmittingBuyer] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { reportError } = useNotifications();
  const [buyerComments, setBuyerComments] = useState<Record<string, string>>({});
  const [buyerHasRated, setBuyerHasRated] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchBuyers = async () => {
      if (!datasetId) return;
      try {
        setLoading(true);
        setError(null);
        const res: DatasetBuyersResponse = await userOrdersApi.getDatasetBuyers(datasetId, token || undefined);
        setBuyers(res.buyers || []);
        console.log('Buyers:', res.buyers);
      } catch (err) {
        console.error('Failed to fetch buyers', err);
        setError('Failed to load buyers');
      } finally {
        setLoading(false);
      }
    };
    fetchBuyers();
  }, [datasetId, token]);

  useEffect(() => {
    const fetchBuyerRatingFlags = async () => {
      if (!buyers.length || !token) return;
      try {
        const results = await Promise.all(
          buyers.map(async (b) => {
            const summary = await ratingApi.getUserRatingSummary(b.id, 'buyer',token);
            return { id: b.id, raterIds: summary.raterIds || [] };
          })
        );
        const flags: Record<string, boolean> = {};
        const avgMap: Record<string, number> = {};
        await Promise.all(
          buyers.map(async (b) => {
            const summary = await ratingApi.getUserRatingSummary(b.id, 'buyer', token);
            avgMap[b.id] = summary.averageRating || 0;
          })
        );
        results.forEach(({ id, raterIds }) => {
          flags[id] = !!(userId && raterIds.includes(userId));
        });
        setBuyerHasRated(flags);
        setBuyerAverageRating(avgMap);
      } catch (e) {
        console.error('Failed to fetch buyer rating flags', e);
      }
    };
    fetchBuyerRatingFlags();
  }, [buyers, userId]);

  const handleRateBuyer = async (buyerId: string, rating: number) => {
    if (!token) {
      console.warn('Must be logged in to rate');
      return;
    }
    try {
      setSubmittingBuyer(prev => ({ ...prev, [buyerId]: true }));
      setBuyerSelectedRating(prev => ({ ...prev, [buyerId]: rating }));
      await ratingApi.submitRating({ userId: buyerId, rating, ratingType: 'buyer', comment: (buyerComments[buyerId] || undefined) }, token);
      setBuyerHasRated(prev => ({ ...prev, [buyerId]: true }));
    } catch (e:unknown) {
      if (e instanceof AxiosError && e.response){
      reportError(e.response.data.error)
      } else {
      reportError('Failed to submit rating');
      }
        setBuyerSelectedRating(prev => ({ ...prev, [buyerId]: 0 }));
      console.error('Failed to submit buyer rating', e);
    } finally {
      setSubmittingBuyer(prev => ({ ...prev, [buyerId]: false }));
    }
  };

  return (
    <aside
      className={clsx(
        ShowRequest ? '-translate-x-full lg:translate-x-0' : 'translate-x-0',
        "fixed top-0 left-0 h-[100vh] shadow-lg overflow-y-auto z-20 pt-24 transform transition-transform duration-300 bg-white dark:bg-[#131313] lg:pt-4 2xl:w-[80%] w-fit lg:sticky col-span-1 lg:top-24 lg:h-fit lg:max-h-[82vh] lg:rounded-xl border-t border-gray-100 dark:border-gray-700 p-4 flex flex-col gap-4"
      )}
    >
        
      
 
        
          <div className="mt-2 border dark:border-gray-600 p-3 rounded-lg">
            <h3 className="font-medium mb-2">Recent Buyers</h3>
            {loading && <div className="text-sm text-gray-500">Loading buyers...</div>}
            {error && <div className="text-sm text-red-500">{error}</div>}
            {!loading && !error && buyers.length === 0 && (
              <div className="text-sm text-gray-500">No buyers yet</div>
            )}
            <ul className="space-y-2">
              {buyers.map(b => (
                 <div
                 key={b.id}
        title={b.name}
         className="flex lg:max-w-full items-center max-w-[231px] border dark:border-gray-600 p-2 rounded-lg gap-3"
       >
          <Image
            src={UserImage}
            alt="author"
            width={50}
            height={50}
            className="rounded-full"
          />
          <div className="flex flex-col">
            <span className="line-clamp-1">{b.name}</span>

            {UploaderId === userId && (
              <div className="flex mt-1">
                {[1,2,3,4,5].map((index) => {
                  const hoverVal = buyerHoverRating[b.id] ?? 0;
                  const selectedVal = buyerSelectedRating[b.id] ?? 0;
                  const effective = buyerHasRated[b.id] ? (buyerAverageRating[b.id] || 0) : (hoverVal || selectedVal);
                  const isActive = index <= effective;
                  const isSubmitting = submittingBuyer[b.id];
                  return (
                    <Star
                      key={index}
                      className={clsx(
                        "w-5 h-5 cursor-pointer transition-colors",
                        isActive ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-300",
                        (isSubmitting || buyerHasRated[b.id]) && "opacity-60 cursor-not-allowed"
                      )}
                      onMouseEnter={() => !buyerHasRated[b.id] && setBuyerHoverRating(prev => ({ ...prev, [b.id]: index }))}
                      onMouseLeave={() => !buyerHasRated[b.id] && setBuyerHoverRating(prev => ({ ...prev, [b.id]: 0 }))}
                      onClick={() => !isSubmitting && !buyerHasRated[b.id] && handleRateBuyer(b.id, index)}
                    />
                  );
                })}
              </div>
            )}

            {/* {!buyerHasRated[b.id] && UploaderId !== userId && (
              <div className="mt-2 flex flex-col gap-2">
                <textarea
                  value={buyerComments[b.id] || ''}
                  onChange={(e) => setBuyerComments(prev => ({ ...prev, [b.id]: e.target.value }))}
                  placeholder="Optional: Add a comment..."
                  className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                  rows={2}
                  maxLength={500}
                />
                <button
                  onClick={() => handleRateBuyer(b.id, buyerSelectedRating[b.id] || 0)}
                  disabled={submittingBuyer[b.id] || (buyerSelectedRating[b.id] || 0) === 0}
                  className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white text-xs rounded-md transition-colors self-start"
                >
                  {submittingBuyer[b.id] ? 'Submitting...' : 'Submit Rating'}
                </button>
              </div>
            )} */}
          </div>
        </div>
              ))}
            </ul>
          </div>
       
      </aside>
  )
}

export default BuyerSidebar
