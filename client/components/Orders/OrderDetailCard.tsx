"use client";

import React, { useState, useEffect } from "react";
import Solana from "@/components/assets/Solana";
import SecondaryBtn from "@/components/SharedComponents/Btns/SecondaryBtn";
import { Calendar, Hash, Download, Star } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/lib/Authentication/AuthContext";
import { ratingApi } from "@/lib/api/RatingApi";
import { useNotifications } from "@/lib/notification-context";
import { AxiosError } from "axios";

type OrderStatus = "processing" | "delivered" | "disputed";

export interface OrderDetailProps {
  id: number | string;
  Title?: string;
  Description?: string;
  Price?: number | string;
  Type?: string;
  Image?: string;
  Tags?: string[];
  status: OrderStatus;
  orderedAt: string;
  txHash?: string;
  onRaiseDispute?: (id: number | string) => void;
  onDownload?: (id: number | string) => void;
}

function OrderDetailCard({
  id,
  Title,
  Description,
  Price,
  Type,
  Image,
  Tags = [],
  status,
  orderedAt,
  txHash,
}: OrderDetailProps) {
  const { token,userId } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [HasRated, setHasRated] = useState<boolean>(false);

  const { reportError } = useNotifications();

  const getStatusColor = (s: OrderStatus) => {
    switch (s) {
      case "processing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200";
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200";
      case "disputed":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200";
    }
  };

  const formattedDate = new Date(orderedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

 useEffect(() => {
  // reset states whenever id changes
  setRating(0);
  setHoveredRating(0);
  setHasRated(false);
  setIsSubmitted(false);
  setComment("");

  const fetchExistingRating = async () => {
    if (!token) return;
    try {
      const userRating = await ratingApi.getDatasetRatingSummary(
        String(id),
        token
      );
        console.log("id:",id);
         if (id && userRating && userId && userRating.raterIds?.includes(userId)) {
        setRating(userRating.averageRating || 0);

       
        if (userId && userRating.raterIds?.includes(userId)) {
          setHasRated(true);
        }
      }
    } catch (error) {
      console.error("Failed to fetch existing rating:", error);
    }
  };

  fetchExistingRating();
}, [token, id]);


  const handleRatingSubmit = async () => {
    if (!rating || !token) return;

    try {
      setIsSubmitting(true);
      await ratingApi.submitRating(
        {
          datasetId: String(id),
          rating,
          comment: comment.trim() || undefined,
          ratingType: "dataset",
        },
        token
      );

      setIsSubmitted(true);
      setComment("");
      setHasRated(true);
    } catch (error: unknown) {
      console.error("Failed to submit rating:", error);
      if (error instanceof AxiosError) {
        reportError(error.response?.data?.error);
      } else {
        reportError("An unknown error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStarRating = () => {
    const effectiveRating = hoveredRating || rating;

    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => {
            if (effectiveRating >= star) {
              // full star
              return (
                <Star
                  key={star}
                  className={clsx(
                    "w-5 h-5",
                    "text-yellow-500 fill-current",
                    !HasRated && "cursor-pointer"
                  )}
                  onClick={() => !HasRated && setRating(star)}
                  onMouseEnter={() => !HasRated && setHoveredRating(star)}
                  onMouseLeave={() => !HasRated && setHoveredRating(0)}
                />
              );
            } else if (effectiveRating >= star - 0.5) {
              // half star
              return (
                <div key={star} className="relative w-5 h-5">
                  <Star className="absolute inset-0 w-5 h-5 text-gray-300" />
                  <div className="absolute inset-0 overflow-hidden w-1/2">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  </div>
                </div>
              );
            } else {
              // empty star
              return (
                <Star
                  key={star}
                  className={clsx(
                    "w-5 h-5 text-gray-300",
                    !HasRated && "hover:text-yellow-400 cursor-pointer"
                  )}
                  onClick={() => !HasRated && setRating(star)}
                  onMouseEnter={() => !HasRated && setHoveredRating(star)}
                  onMouseLeave={() => !HasRated && setHoveredRating(0)}
                />
              );
            }
          })}
          {rating > 0 && (
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              {rating} star{rating !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Show comment + submit only if not rated before */}
        {!HasRated && rating > 0 && (
          <div className="flex flex-col gap-2">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Optional: Add a comment..."
              className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
              rows={2}
              maxLength={500}
            />
            <button
              onClick={handleRatingSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white text-sm rounded-md transition-colors"
            >
              {isSubmitting ? "Submitting..." : "Submit Rating"}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4">
        <div className="w-full">
          {Image ? (
            <img
              src={Image}
              alt={Title || "Dataset preview"}
              className="object-cover border max-h-[400px] border-gray-100 dark:border-gray-700 rounded-lg w-full aspect-video"
            />
          ) : (
            <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-lg w-full aspect-video flex items-center justify-center text-gray-500">
              No Preview
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-xl md:text-2xl font-bold line-clamp-1 text-gray-900 dark:text-white truncate">
                {Title}
              </h2>
              {Type && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  File type: {Type}
                </p>
              )}
            </div>
            <span
              className={clsx(
                "shrink-0 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium",
                getStatusColor(status)
              )}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>

          {Description && (
            <p className="mt-3 text-gray-600 dark:text-gray-300 line-clamp-2">
              {Description}
            </p>
          )}

          {!!Tags.length && (
            <div className="mt-3 flex flex-wrap gap-2">
              {Tags.slice(0, 6).map((tag, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-5 flex justify-between items-center flex-wrap gap-4">
            <div className="col-span-1 flex flex-col justify-center gap-2">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Price
              </div>
              <div
                title="Price in Solana"
                className="flex gap-2 items-center"
              >
                <Solana size={24} />
                <div className="text-2xl font-semibold">{Price}</div>
              </div>
            </div>
            <div className="col-span-1 flex flex-col justify-center gap-2">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Rate Dataset
              </div>
              {renderStarRating()}
            </div>
            <div className="col-span-1 flex flex-col justify-center gap-2">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Ordered
              </div>
              <div className="flex gap-2 items-center">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div className="font-medium">{formattedDate}</div>
              </div>
            </div>
            <div className="col-span-1 flex flex-col justify-center gap-2">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Transaction
              </div>
              <div title={txHash} className="flex gap-2 items-center">
                <Hash className="w-5 h-5 text-gray-500" />
                <div className="font-medium truncate max-w-24">{txHash || "—"}</div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <SecondaryBtn
              className="bg-gray-900 dark:bg-white text-white dark:text-black hover:opacity-90"
              Href={`/decrypt-dataset/${id}`}
            >
              <Download className="w-4 h-4" /> Download Dataset
            </SecondaryBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailCard;
