import React from 'react';

const ReviewSkeleton = () => {
  return (
    <div className="py-6 border-b border-slate-100 last:border-0 animate-pulse px-2 sm:px-4">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        {/* Left Column */}
        <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:w-48 shrink-0">
           <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0"></div>
           <div className="flex flex-col gap-2 w-full">
             <div className="h-3.5 bg-slate-200 rounded w-24"></div>
             <div className="h-2.5 bg-slate-200 rounded w-16"></div>
           </div>
        </div>

        {/* Right Column */}
        <div className="flex-1 w-full">
          <div className="flex gap-1 mb-4">
             {[1,2,3,4,5].map(i => (
                <div key={i} className="w-4 h-4 bg-slate-200 rounded-sm"></div>
             ))}
          </div>
          <div className="h-4 bg-slate-200 rounded w-1/3 mb-3"></div>
          <div className="space-y-2">
            <div className="h-3 bg-slate-200 rounded w-full"></div>
            <div className="h-3 bg-slate-200 rounded w-5/6"></div>
            <div className="h-3 bg-slate-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSkeleton;
