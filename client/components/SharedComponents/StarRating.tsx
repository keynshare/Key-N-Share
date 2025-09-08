import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating?: number;
  maxRating?: number;
  size?: number;
  editable?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating = 0,
  maxRating = 5,
  size = 20,
  editable = false,
  onRatingChange,
  className = '',
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(rating);

  const handleMouseEnter = (index: number) => {
    if (!editable) return;
    setHoverRating(index);
  };

  const handleMouseLeave = () => {
    if (!editable) return;
    setHoverRating(0);
  };

  const handleClick = (index: number) => {
    if (!editable) return;
    setSelectedRating(index);
    if (onRatingChange) {
      onRatingChange(index);
    }
  };

  const displayRating = hoverRating || selectedRating || rating;

  return (
    <div className={`flex items-center ${className}`}>
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        return (
          <Star
            key={index}
            size={size}
            className={`cursor-${editable ? 'pointer' : 'default'} transition-colors duration-200 ${starValue <= displayRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
          />
        );
      })}
      {displayRating > 0 && (
        <span className="ml-2 text-sm font-medium">{displayRating.toFixed(1)}</span>
      )}
    </div>
  );
};

export default StarRating;