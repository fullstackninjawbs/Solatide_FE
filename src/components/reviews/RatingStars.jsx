import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const StarIcon = ({ filled, half, className = '' }) => (
  <svg
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {half ? (
      <>
        <defs>
          <linearGradient id="half-fill">
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="transparent" stopOpacity="1" />
          </linearGradient>
        </defs>
        <polygon
          points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
          fill="url(#half-fill)"
        />
      </>
    ) : (
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    )}
  </svg>
);

const RatingStars = ({
  rating = 0,
  interactive = false,
  onRatingChange,
  size = 24,
  color = '#008060', // Shopify deep green
  emptyColor = '#e3e3e3'
}) => {
  const [hover, setHover] = useState(null);

  return (
    <div className="flex items-center gap-1" onMouseLeave={() => interactive && setHover(null)}>
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        const currentRating = hover || rating;
        
        let isFilled = currentRating >= starValue;
        let isHalf = !isFilled && currentRating > index && currentRating < starValue;

        return (
          <label
            key={index}
            className={`${interactive ? 'cursor-pointer' : ''} relative flex items-center justify-center`}
            style={{ width: size, height: size }}
            onMouseEnter={() => interactive && setHover(starValue)}
          >
            {interactive && (
              <input
                type="radio"
                name="rating"
                className="hidden"
                value={starValue}
                onClick={() => onRatingChange && onRatingChange(starValue)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onRatingChange && onRatingChange(starValue);
                    }
                }}
              />
            )}
            
            {/* Empty Star Background */}
            <StarIcon 
                filled={false} 
                className="absolute inset-0" 
                style={{ color: emptyColor }}
            />
            
            {/* Filled / Half Star Overlay with Animation */}
            <AnimatePresence>
                {(isFilled || isHalf) && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0"
                    style={{ color: color }}
                  >
                     <StarIcon filled={isFilled} half={isHalf} className="w-full h-full" />
                  </motion.div>
                )}
            </AnimatePresence>
          </label>
        );
      })}
    </div>
  );
};

export default RatingStars;
