import React from 'react';
import { motion } from 'framer-motion';
import RatingStars from './RatingStars';

const StepReview = ({ product, rating, title, setTitle, comment, setComment, onNext, onBack }) => {
  
  const handleNext = () => {
    if (comment.trim().length < 10) return;
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col p-6"
    >
      {/* Product Summary Header */}
      <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl mb-6">
        <div className="flex items-center gap-3">
          <img src={product?.imageUrl} alt="" className="w-12 h-12 object-contain rounded bg-white" />
          <div className="flex flex-col text-left">
             <span className="font-semibold text-[13px] text-slate-800 line-clamp-1">{product?.name}</span>
             <RatingStars rating={rating} size={14} color="#008060" />
          </div>
        </div>
        <button onClick={onBack} className="text-[#008060] underline text-[13px] font-medium hover:text-[#006e52]">
          Edit
        </button>
      </div>

      <div className="flex flex-col text-left gap-5">
        <div>
          <label className="block text-[13px] font-semibold text-slate-800 mb-1.5">Review title (Optional)</label>
          <input 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Summarize your experience"
            className="w-full border border-slate-200 rounded-lg p-3 text-[14px] focus:ring-2 focus:ring-[#008060]/20 focus:border-[#008060] outline-none"
          />
        </div>

        <div>
          <label className="block text-[13px] font-semibold text-slate-800 mb-1.5">Review content (Required)</label>
          <textarea 
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="5"
            placeholder="Start writing here..."
            className="w-full border border-slate-200 rounded-lg p-3 text-[14px] focus:ring-2 focus:ring-[#008060]/20 focus:border-[#008060] outline-none resize-none"
          />
          {comment.length > 0 && comment.length < 10 && (
            <span className="text-red-500 text-[12px] mt-1.5 block">Minimum 10 characters required.</span>
          )}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button 
          onClick={onBack}
          className="text-slate-600 font-semibold text-sm px-4 py-2 hover:bg-slate-50 rounded"
        >
          ← Back
        </button>
        <button 
          onClick={handleNext}
          disabled={comment.trim().length < 10}
          className="bg-[#008060] hover:bg-[#006e52] text-white font-semibold text-sm py-2.5 px-8 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </motion.div>
  );
};

export default StepReview;
