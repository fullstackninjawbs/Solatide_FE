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
      className="border border-slate-200 rounded-2xl p-6 bg-white hover:shadow-md transition-shadow duration-300 flex flex-col h-full"
    >
      {/* Top Row: Avatar and User Info */}
      <div className="flex items-center gap-3 mb-4">
        {review.avatar ? (
          <img src={review.avatar} alt={review.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-[#f0f4f8] text-slate-700 font-bold text-[14px] flex items-center justify-center uppercase shrink-0">
            {getInitials(review.displayName || review.name)}
          </div>
        )}
        <div className="flex flex-col">
          <h5 className="font-bold text-[#1E1E1E] text-[14px] leading-tight">
            {review.displayName || review.name || 'Anonymous'}
          </h5>
          <span className="text-slate-400 text-[12px] mt-0.5">
            {review.role || 'Biotech Researcher'}
          </span>
        </div>
      </div>

      {/* Middle Row: Stars and Date */}
      <div className="flex items-center justify-between mb-4">
        <RatingStars rating={review.rating} size={16} color="#FFB800" />
        <span className="text-slate-400 text-[12px]">
          {formattedDate}
        </span>
      </div>

      {/* Bottom Row: Review Content */}
      <div className="text-left flex-grow">
        {review.title && review.title !== 'good Prodects' && (
          <h4 className="font-bold text-slate-900 text-[14px] mb-2">
            {review.title}
          </h4>
        )}

        <p className="text-[#6A6A6A] text-[13px] leading-[1.6] whitespace-pre-wrap font-medium">
          "{review.content || review.comment}"
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
