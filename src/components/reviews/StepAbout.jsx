import React from 'react';
import { motion } from 'framer-motion';

const StepAbout = ({ name, setName, email, setEmail, isAnonymous, setIsAnonymous, onNext, onBack }) => {
  const isEmailValid = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);
  const isNameValid = isAnonymous || name.trim().length > 0;
  
  const handleNext = () => {
    if (isEmailValid && isNameValid) {
      onNext();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col p-6"
    >
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-slate-900 mb-2">About you</h3>
        <p className="text-[14px] text-slate-500">Please tell us more about you.</p>
      </div>

      <div className="flex flex-col text-left gap-5">
        <div>
          <label className="block text-[13px] font-semibold text-slate-800 mb-1.5">Email address (Required)</label>
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="w-full border border-slate-200 rounded-lg p-3 text-[14px] focus:ring-2 focus:ring-[#008060]/20 focus:border-[#008060] outline-none"
          />
          <p className="text-[11px] text-slate-400 mt-1.5">We respect your privacy.</p>
        </div>

        <div>
          <label className="block text-[13px] font-semibold text-slate-800 mb-1.5">Display name (Required)</label>
          <input 
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isAnonymous}
            placeholder={isAnonymous ? "Anonymous" : "Display name"}
            className="w-full border border-slate-200 rounded-lg p-3 text-[14px] focus:ring-2 focus:ring-[#008060]/20 focus:border-[#008060] outline-none disabled:bg-slate-50 disabled:text-slate-400"
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer mt-1">
          <input 
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="w-4 h-4 text-[#008060] rounded border-slate-300 focus:ring-[#008060]"
          />
          <span className="text-[13px] text-slate-700">Post review as anonymous</span>
        </label>
      </div>

      <div className="flex justify-between mt-10">
        <button 
          onClick={onBack}
          className="text-slate-600 font-semibold text-sm px-4 py-2 hover:bg-slate-50 rounded"
        >
          ← Back
        </button>
        <button 
          onClick={handleNext}
          disabled={!(isEmailValid && isNameValid)}
          className="bg-[#008060] hover:bg-[#006e52] text-white font-semibold text-sm py-2.5 px-8 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </motion.div>
  );
};

export default StepAbout;
