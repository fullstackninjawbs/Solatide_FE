import React from 'react';

const CurrentBatchCard = ({ batch }) => {
  if (!batch || batch.status === 'inactive') return null;

  return (
    <div className="bg-[#f8fafc] rounded-2xl border border-slate-200 p-6 mb-8 mt-4 font-['Poppins']">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-200/60">
        <div>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Current Batch Record</h3>
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-[#1E1E1E]">{batch.batchId}</span>
            {batch.coaStatus === 'approved' ? (
              <span className="bg-[#e0f2fe] text-[#0369a1] text-xs font-bold px-2.5 py-1 rounded-full border border-[#bae6fd]">
                Now Shipping
              </span>
            ) : (
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-200">
                COA Pending
              </span>
            )}
          </div>
        </div>
        
        {batch.coaUrl && batch.coaStatus === 'approved' && (
          <button
            onClick={() => window.open(batch.coaUrl, '_blank')}
            className="shrink-0 bg-white hover:bg-slate-50 text-[#214A9E] border border-slate-300 text-sm font-semibold py-2.5 px-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            View COA
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-5">
        {batch.purity && (
          <div>
            <span className="text-xs text-slate-500 font-medium block mb-1">Purity</span>
            <span className="text-[15px] font-semibold text-slate-800">{batch.purity}</span>
          </div>
        )}
        {batch.measuredContent && (
          <div>
            <span className="text-xs text-slate-500 font-medium block mb-1">Measured Content</span>
            <span className="text-[15px] font-semibold text-slate-800">{batch.measuredContent}</span>
          </div>
        )}
        {batch.method && (
          <div>
            <span className="text-xs text-slate-500 font-medium block mb-1">Testing Method</span>
            <span className="text-[15px] font-semibold text-slate-800">{batch.method}</span>
          </div>
        )}
      </div>

      {/* Flags */}
      <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-200/60">
        {batch.includesPurity && (
          <div className="flex items-center gap-1.5 text-[13px] font-medium text-slate-600">
            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Purity Tested
          </div>
        )}
        {batch.includesMeasuredContent && (
          <div className="flex items-center gap-1.5 text-[13px] font-medium text-slate-600">
            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Content Verified
          </div>
        )}
        {(batch.includesEndotoxin || batch.hasEndotoxinTest) && (
          <div className="flex items-center gap-1.5 text-[13px] font-medium text-slate-600">
            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Endotoxin Tested
          </div>
        )}
        {(batch.includesSterility || batch.hasSterilityTest) && (
          <div className="flex items-center gap-1.5 text-[13px] font-medium text-slate-600">
            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Sterility Tested
          </div>
        )}
      </div>
      
      {/* Additional Reports links */}
      {(batch.endotoxinReportUrl || batch.sterilityReportUrl) && (
        <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-slate-200/60">
          {batch.endotoxinReportUrl && (
            <a href={batch.endotoxinReportUrl} target="_blank" rel="noopener noreferrer" className="text-[13px] font-semibold text-[#214A9E] hover:underline flex items-center gap-1">
              Endotoxin Report →
            </a>
          )}
          {batch.sterilityReportUrl && (
            <a href={batch.sterilityReportUrl} target="_blank" rel="noopener noreferrer" className="text-[13px] font-semibold text-[#214A9E] hover:underline flex items-center gap-1">
              Sterility Report →
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default CurrentBatchCard;
