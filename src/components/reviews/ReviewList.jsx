import React, { useState, useEffect } from 'react';
import ReviewCard from './ReviewCard';
import ReviewSkeleton from './ReviewSkeleton';
import { motion } from 'framer-motion';

const ReviewList = ({ reviews = [], isLoading, onWriteReview }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  // Reset to first page when reviews change (e.g. sorting/filtering applied)
  useEffect(() => {
    setCurrentPage(1);
  }, [reviews]);

  if (isLoading) {
    return (
      <div className="w-full border-t border-slate-100 pt-6">
        {[1, 2, 3].map(i => <ReviewSkeleton key={i} />)}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full flex flex-col items-center justify-center py-20 border-t border-slate-300"
      >
        <div className="w-24 h-24 mb-6 text-slate-300">
          {/* Simple Empty State Illustration (using SVG) */}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">No Reviews Yet</h3>
        <p className="text-slate-500 mb-6 text-center max-w-sm">Be the first to share your experience with this product.</p>
      </motion.div>
    );
  }

  // Pagination Logic
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const currentReviews = reviews.slice(startIndex, startIndex + reviewsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Optional: smooth scroll back to the top of the reviews section
      document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentReviews.map((review, index) => (
          <ReviewCard key={review.id || review._id} review={review} index={index} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-12 mb-4">
          {/* Prev Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center rounded bg-slate-200/60 text-slate-400 hover:bg-slate-200 hover:text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-2">
            {getPageNumbers().map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-8 h-8 flex items-center justify-center rounded border text-[13px] font-medium transition-colors ${
                  currentPage === page 
                    ? 'border-[#0079CD] text-[#0079CD] bg-white' 
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
