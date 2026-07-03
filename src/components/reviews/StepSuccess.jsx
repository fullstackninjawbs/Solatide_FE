import React from 'react';
import { motion } from 'framer-motion';

const StepSuccess = ({ onClose }) => {
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
         <div className="flex justify-center gap-2 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
               <svg key={star} className="w-10 h-10 text-[#008060] cursor-pointer hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
               </svg>
            ))}
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
