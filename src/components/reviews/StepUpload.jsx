import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ImageUploader from './ImageUploader';

const StepUpload = ({ files, setFiles, videoUrl, setVideoUrl, onBack, onSubmit, isSubmitting }) => {
  const [showVideoInput, setShowVideoInput] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col p-6"
    >
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-slate-900 mb-2">Share a picture or video</h3>
        <p className="text-[14px] text-slate-500">Upload a photo or video to support your review.</p>
      </div>

      <div className="flex flex-col text-left gap-6">
        <ImageUploader files={files} setFiles={setFiles} />

        {/* Video URL section */}
        <div className="border-t border-slate-100 pt-4">
           {!showVideoInput ? (
             <button 
                onClick={() => setShowVideoInput(true)}
                className="text-[13px] font-medium text-[#008060] hover:underline"
             >
                + Add YouTube Video URL
             </button>
           ) : (
             <div>
               <label className="block text-[12px] font-medium text-slate-600 mb-1.5">YouTube URL</label>
               <input 
                 value={videoUrl}
                 onChange={(e) => setVideoUrl(e.target.value)}
                 placeholder="Paste your YouTube URL here"
                 className="w-full border border-slate-200 rounded p-2.5 text-[13px] focus:ring-1 focus:ring-[#008060] focus:border-[#008060] outline-none"
               />
             </div>
           )}
        </div>
      </div>

      <div className="flex justify-between mt-10">
        <button 
          onClick={onBack}
          disabled={isSubmitting}
          className="text-slate-600 font-semibold text-sm px-4 py-2 hover:bg-slate-50 rounded disabled:opacity-50"
        >
          ← Back
        </button>
        <button 
          onClick={onSubmit}
          disabled={isSubmitting}
          className="bg-[#008060] hover:bg-[#006e52] text-white font-semibold text-sm py-2.5 px-8 rounded transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            'Submit'
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default StepUpload;
