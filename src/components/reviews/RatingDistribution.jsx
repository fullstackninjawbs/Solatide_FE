import React from 'react';
import { motion } from 'framer-motion';

const RatingDistribution = ({ reviews = [] }) => {
  const totalReviews = reviews.length;

  const getPercentage = (star) => {
    if (totalReviews === 0) return 0;
    const count = reviews.filter((r) => r.rating === star).length;
    return Math.round((count / totalReviews) * 100);
  };

  return (
    <div className="w-full flex flex-col gap-2.5">
      {[5, 4, 3, 2, 1].map((star) => {
        const percentage = getPercentage(star);
        return (
          <div key={star} className="flex items-center gap-3 w-full group cursor-default">
            {/* Star Label */}
            <div className="flex items-center gap-1 w-16 shrink-0">
              <span className="text-[13px] font-medium text-slate-700">{star}</span>
              <svg className="w-3.5 h-3.5 text-[#008060]" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            
            {/* Progress Bar */}
            <div className="flex-1 h-[6px] bg-slate-100 rounded-full overflow-hidden relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute left-0 top-0 bottom-0 bg-[#008060] rounded-full"
              />
            </div>
            
            {/* Percentage */}
            <div className="w-10 shrink-0 text-right text-[13px] font-medium text-slate-500">
              {percentage}%
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RatingDistribution;
