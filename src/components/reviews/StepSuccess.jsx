import React, { useState } from 'react';
import { motion } from 'framer-motion';
import RatingStars from './RatingStars';

const StepSuccess = ({ onClose }) => {
  const [storeRating, setStoreRating] = useState(0);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center text-center px-8 py-10"
    >
      <h3 className="text-[20px] text-slate-800 mb-4 font-normal">Thanks for your review!</h3>
      <p className="text-[14px] text-slate-600 mb-4">We are processing it and it will appear on the store soon.</p>
      
      <p className="text-[12px] text-slate-500 mb-10 max-w-[90%]">
        Please confirm your email by clicking the link we just sent you. This helps us keep reviews authentic.
      </p>

      <h4 className="text-[18px] text-slate-800 mb-4 max-w-[90%] font-normal">
        Would you like to share your experience of shopping with us?
      </h4>
      <p className="text-[13px] text-slate-600 mb-8 max-w-[95%]">
        We value your feedback and use it to improve. Please share any thoughts or suggestions you have.
      </p>

      <div className="flex flex-col items-center mb-10 w-full">
         <div className="flex justify-center w-full mb-2">
            <RatingStars 
              rating={storeRating} 
              interactive={true} 
              onRatingChange={setStoreRating} 
              size={42}
            />
         </div>
         <div className="flex justify-between w-full max-w-[240px] text-[11px] font-bold text-slate-700">
            <span>Poor</span>
            <span>Great</span>
         </div>
      </div>

      <button 
        onClick={onClose}
        className="bg-[#008060] hover:bg-[#006e52] text-white font-medium text-[13px] px-8 py-2 rounded transition-colors"
      >
        Close
      </button>
    </motion.div>
  );
};

export default StepSuccess;
