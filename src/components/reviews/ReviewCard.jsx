import React, { useState } from 'react';
import { motion } from 'framer-motion';
import RatingStars from './RatingStars';
import Lightbox from './Lightbox';

const ReviewCard = ({ review, index }) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'A';
  };

  const formattedDate = new Date(review.createdAt || Date.now()).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const handleImageClick = (idx) => {
    setLightboxIndex(idx);
    setIsLightboxOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="py-6 border-b border-slate-300 last:border-0 hover:bg-slate-50/30 transition-colors duration-300 flex flex-col gap-4"
    >
      {/* Row 1: Stars */}
      <div className="mb-1">
        <RatingStars rating={review.rating} size={20} color="#2B7868" />
      </div>

      {/* Row 2: Avatar + Name + Date */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#f0f4f8] text-slate-700 font-bold text-[13px] flex items-center justify-center uppercase shrink-0">
          {getInitials(review.displayName || review.name)}
        </div>
        <div className="flex flex-col">
          <h5 className="font-bold text-slate-900 text-[13px] leading-tight flex items-center gap-2">
            {review.displayName || review.name || 'Anonymous'}
            {(review.verified || review.isVerifiedPurchase) && (
              <span className="text-[#008060] text-[10px] font-bold uppercase tracking-wider flex items-center gap-0.5">
                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verified
              </span>
            )}
          </h5>
          <span className="text-slate-400 text-[11px] mt-0.5">
            {formattedDate}
          </span>
        </div>
      </div>

      {/* Row 3 & 4: Review Content */}
      <div className="text-left mt-1">
        {review.title && (
          <h4 className="font-bold text-slate-900 text-[14px] mb-1.5">
            {review.title}
          </h4>
        )}

        <p className="text-slate-600 text-[13px] leading-relaxed whitespace-pre-wrap">
          {review.content || review.comment}
        </p>

        {/* Attached Images */}
        {review.images && review.images.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {review.images.map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => handleImageClick(idx)}
                className="w-16 h-16 rounded-md overflow-hidden border border-slate-200 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#008060]"
              >
                <img src={imgUrl} alt="Review attachment" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <Lightbox
        images={review.images}
        isOpen={isLightboxOpen}
        initialIndex={lightboxIndex}
        onClose={() => setIsLightboxOpen(false)}
      />
    </motion.div>
  );
};

export default ReviewCard;
