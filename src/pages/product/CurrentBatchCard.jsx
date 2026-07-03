import React from 'react';
import { HelpCircle, FileText, ChevronRight, Clock } from 'lucide-react';

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
        <div className="flex items-center mb-1">
          <span className="text-[15px] font-bold text-slate-800">{batch.batchId}</span>
          {batch.coaStatus === 'approved' ? (
            <span className="bg-[#E6F4EA] text-[#137333] text-[11px] font-bold px-2.5 py-0.5 rounded-full ml-3 tracking-wide">
              Now Shipping
            </span>
          ) : (
            <span className="bg-[#FFF3E0] text-[#C05621] text-[11.5px] font-bold px-3 py-1 rounded-full ml-3">
              Documentation Pending
            </span>
          )}
        </div>

        {batch.coaStatus === 'approved' ? (
          <>
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

            {/* Endotoxin Report Card */}
            {batch.endotoxinReportUrl && (
              <div 
                onClick={() => window.open(batch.endotoxinReportUrl, '_blank')}
                className="bg-white border border-slate-200/80 rounded-xl p-3.5 mt-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 hover:border-slate-350 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)] group"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-[#214A9E] shrink-0" />
                  <div className="text-left">
                    <p className="text-[13.5px] font-bold text-[#214A9E] group-hover:underline">
                      View endotoxin report
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4.5 h-4.5 text-slate-400 group-hover:text-[#214A9E] transition-colors" />
              </div>
            )}

            {/* Sterility Report Card */}
            {batch.sterilityReportUrl && (
              <div 
                onClick={() => window.open(batch.sterilityReportUrl, '_blank')}
                className="bg-white border border-slate-200/80 rounded-xl p-3.5 mt-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 hover:border-slate-350 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)] group"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-[#214A9E] shrink-0" />
                  <div className="text-left">
                    <p className="text-[13.5px] font-bold text-[#214A9E] group-hover:underline">
                      View sterility report
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4.5 h-4.5 text-slate-400 group-hover:text-[#214A9E] transition-colors" />
              </div>
            )}
          </>
        ) : (
          <div className="bg-white border border-slate-200/80 rounded-xl p-4 mt-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-start gap-3">
            <Clock className="w-[18px] h-[18px] text-[#C05621] shrink-0 mt-[3px] stroke-2" />
            <div className="text-left">
              <p className="text-[14.5px] font-bold text-[#1a3a7d]">
                COA / documentation pending
              </p>
              <p className="text-[13.5px] text-slate-500 mt-1 leading-relaxed">
                Batch-specific documentation is being finalised and will be uploaded once available.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentBatchCard;
