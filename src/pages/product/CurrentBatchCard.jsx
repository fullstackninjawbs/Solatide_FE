import React from 'react';
import { HelpCircle, FileText, ChevronRight } from 'lucide-react';

const CurrentBatchCard = ({ batch }) => {
  if (!batch || batch.status === 'inactive') return null;

  const includesList = [];
  if (batch.includesPurity) includesList.push('HPLC Purity');
  if (batch.includesMeasuredContent) includesList.push('Net content');
  if (batch.includesEndotoxin) includesList.push('Endotoxin');
  if (batch.includesSterility) includesList.push('Sterility');
  const includesString = includesList.length > 0 ? `Includes: ${includesList.join(' · ')}` : '';

  const handleOpenCoa = () => {
    if (batch.coaUrl) {
      window.open(batch.coaUrl, '_blank');
    }
  };

  return (
    <div className="text-left font-['Poppins']">
      <div className="flex items-center gap-1.5 mb-2.5">
        <span className="text-[14.5px] font-bold text-slate-800">Current Batch</span>
        <HelpCircle className="w-3.5 h-3.5 text-slate-400 cursor-help shrink-0" title="Testing details for the current physical batch of this compound" />
      </div>

      <div className="bg-[#f8fafc] rounded-2xl border border-slate-200 p-4 mb-4">
        <div className="flex items-center">
          <span className="text-[15px] font-bold text-slate-855">{batch.batchId}</span>
          {batch.coaStatus === 'approved' ? (
            <span className="bg-[#E6F4EA] text-[#137333] text-[11px] font-bold px-2.5 py-0.5 rounded-full ml-3 tracking-wide">
              Now Shipping
            </span>
          ) : (
            <span className="bg-amber-50 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full ml-3 tracking-wide">
              COA Pending
            </span>
          )}
        </div>

        {batch.coaUrl && (
          <div 
            onClick={handleOpenCoa}
            className="bg-white border border-slate-200/80 rounded-xl p-3.5 mt-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 hover:border-slate-350 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)] group"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-[#214A9E] shrink-0" />
              <div className="text-left">
                <p className="text-[13.5px] font-bold text-[#214A9E] group-hover:underline">
                  View current batch COA
                </p>
                {includesString && (
                  <p className="text-[11.5px] text-slate-500 font-medium mt-0.5">
                    {includesString}
                  </p>
                )}
              </div>
            </div>
            <ChevronRight className="w-4.5 h-4.5 text-slate-400 group-hover:text-[#214A9E] transition-colors" />
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentBatchCard;
