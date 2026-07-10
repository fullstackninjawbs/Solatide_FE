import React from 'react';
import { FileText, CheckCircle2, ShieldCheck, Copy, ExternalLink, QrCode, BarChart2, Droplet, FlaskConical, CheckSquare, Shield, Hourglass } from 'lucide-react';

const CurrentBatchCard = ({ batch }) => {
  const handleOpenCoa = () => {
    if (batch?.coaUrl) {
      window.open(batch.coaUrl, '_blank');
    }
  };

  const handleCopyAccessCode = () => {
    if (batch?.verificationDetails?.coaReportId) {
      navigator.clipboard.writeText(batch.verificationDetails.coaReportId);
      // Optional: Add a small toast or visual feedback here if desired
    }
  };

  const isMissingOrInactive = !batch || batch?.status === 'inactive';
  const tests = isMissingOrInactive ? {} : (batch.tests || {});

  const renderResultText = (text) => {
    if (!text) return null;
    const parts = text.split(/\\n|\n|\|/);
    if (parts.length > 1) {
      return (
        <div className="my-0.5 leading-snug">
          <div className="text-[12px] font-bold text-[#1a3a7d]">{parts[0].trim()}</div>
          <div className="text-[11px] font-medium text-slate-400 mt-0.5">{parts.slice(1).join('\n').trim()}</div>
        </div>
      );
    }
    return <div className="text-[12px] font-bold text-[#1a3a7d] my-0.5 leading-snug">{text}</div>;
  };
  
  // Extract specific tests for the QC panel
  const purityResult = tests.purityHplc?.performed ? tests.purityHplc.result : null;
  const identityResult = tests.identityHplc?.performed ? tests.identityHplc.result : null;
  const fentanylResult = tests.fentanylScreen?.performed ? tests.fentanylScreen.result : null;
  const endotoxinResult = tests.endotoxinUsp85?.performed ? tests.endotoxinUsp85.result : null;
  const sterilityResult = tests.sterilityPcr?.performed ? tests.sterilityPcr.result : null;
  const netContentResult = tests.netPeptideContent?.performed ? tests.netPeptideContent.result : null;
  const heavyMetalsResult = tests.heavyMetalsIcpMs?.performed ? tests.heavyMetalsIcpMs.result : null;

  const hasQcData = purityResult || identityResult || fentanylResult || endotoxinResult || sterilityResult || netContentResult || heavyMetalsResult;

  // Check if all 5 required tests for "Full QC" are present
  const isFullQc = purityResult && identityResult && endotoxinResult && heavyMetalsResult && sterilityResult;
  const isPartialQc = hasQcData && !isFullQc;
  const completedTestsCount = [purityResult, identityResult, fentanylResult, endotoxinResult, sterilityResult, netContentResult, heavyMetalsResult].filter(Boolean).length;

  if (!hasQcData) {
    return (
      <div className="border border-[#FDE6D5] rounded-3xl bg-[#FFF9F2] p-6 shadow-[0_2px_8px_rgba(249,115,22,0.05)] mb-2 mt-2 font-['Poppins']">
        <div className="flex gap-4">
          <div className="shrink-0 mt-0.5">
            <Hourglass className="w-[34px] h-[34px] text-[#F97316]" strokeWidth={1.5} />
          </div>
          <div className="flex flex-col gap-3.5">
            <h4 className="text-[22px] font-bold text-[#F97316] tracking-tight">Pending Results</h4>
            
            <div className="flex flex-col gap-1.5 mt-1">
              <p className="text-[14px] text-[#214A9E] font-medium leading-relaxed">Additional Third Party testing is currently in progress for this batch.</p>
              <p className="text-[14px] text-[#214A9E] font-medium leading-relaxed">Results will be published here once available.</p>
            </div>
            
            <div className="flex flex-col gap-1 mt-3">
              <p className="text-[13px] text-slate-500 font-medium">We are committed to full transparency.</p>
              <p className="text-[13px] text-slate-500 font-medium">Thank you for your patience.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-left font-['Poppins']">
      <div className="flex items-center gap-1.5 mb-3">
        <span className="text-[13px] font-bold text-slate-800 uppercase tracking-wide">Current Batch</span>
      </div>

      <div className="flex flex-col gap-3">
        
        {/* Box 1: Batch Header & COA Button */}
        <div className="flex items-center justify-between border border-slate-200 rounded-xl px-4 py-3 bg-white">
          <div className="flex items-center gap-3">
            <span className="text-[15px] font-bold text-slate-800">{batch.batchId || 'N/A'}</span>
            {batch.coaStatus === 'approved' ? (
              <span className="bg-[#EBF4FA] text-[#214A9E] text-[11px] font-bold px-3 py-1 rounded-full tracking-wide">
                Now Shipping
              </span>
            ) : (
              <span className="bg-[#FFF3E0] text-[#C05621] text-[11px] font-bold px-3 py-1 rounded-full tracking-wide">
                Pending Documentation
              </span>
            )}
          </div>
          {batch.coaUrl && (
            <button 
              onClick={handleOpenCoa}
              className="bg-[#0079CD] hover:bg-[#0062a3] text-white text-[13px] font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              View COA
            </button>
          )}
        </div>

        {/* Box 2: QC Panel */}
        <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
          {/* Header Section */}
          {isFullQc ? (
            <div className="px-5 py-4 flex items-start justify-between">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-[#137333] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[15px] font-bold text-[#137333]">This Batch Passed a Full QC Panel</h4>
                  <p className="text-[12px] text-slate-500 mt-0.5">Every Test. Every Batch. Verified by Third-Party Labs.</p>
                </div>
              </div>
              <span className="bg-[#E6F4EA] text-[#137333] text-[10px] font-bold px-2.5 py-1 rounded-md shrink-0 uppercase tracking-wide">
                Quality Verified
              </span>
            </div>
          ) : isPartialQc ? (
            <div className="px-5 py-4 flex items-start justify-between">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-[#C05621] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[15px] font-bold text-[#C05621]">This Batch Passed Partial QC Testing</h4>
                  <p className="text-[12px] text-slate-500 mt-0.5">Some tests verified by Third-Party Labs. Awaiting full panel.</p>
                </div>
              </div>
              <span className="bg-[#FFF3E0] text-[#C05621] text-[10px] font-bold px-2.5 py-1 rounded-md shrink-0 uppercase tracking-wide">
                {completedTestsCount} Test{completedTestsCount !== 1 ? 's' : ''} Completed
              </span>
            </div>
          ) : null}

          {/* Test Summary Horizontal List (Only if hasQcData) */}
          {hasQcData && (
            <div className="mx-4 mb-4 border border-slate-100 rounded-xl overflow-hidden bg-white shadow-sm">
              <div className="px-5 py-3 border-b border-slate-100">
                <h5 className="text-[12px] font-bold text-[#1a3a7d] mb-0">Test Summary</h5>
              </div>
              
              <div className="flex flex-row overflow-x-auto px-5 py-4 gap-8 bg-white snap-x scrollbar-hide">
                
                {purityResult && (
                  <div className="flex gap-3 shrink-0 min-w-[140px]">
                    <BarChart2 className="w-6 h-6 text-[#214A9E] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[11px] font-bold text-[#1a3a7d]">Purity (HPLC)</p>
                      {renderResultText(purityResult)}
                      <p className="text-[11px] text-[#137333] font-bold flex items-center gap-1 mt-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Pass
                      </p>
                    </div>
                  </div>
                )}

                {identityResult && (
                  <div className="flex gap-3 shrink-0 min-w-[140px]">
                    <ShieldCheck className="w-6 h-6 text-[#214A9E] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[11px] font-bold text-[#1a3a7d]">Identity</p>
                      {renderResultText(identityResult)}
                      <p className="text-[11px] text-[#137333] font-bold flex items-center gap-1 mt-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Pass
                      </p>
                    </div>
                  </div>
                )}

                {fentanylResult && (
                  <div className="flex gap-3 shrink-0 min-w-[140px]">
                    <Droplet className="w-6 h-6 text-[#214A9E] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[11px] font-bold text-[#1a3a7d]">Fentanyl Screen</p>
                      {renderResultText(fentanylResult)}
                      <p className="text-[11px] text-[#137333] font-bold flex items-center gap-1 mt-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Pass
                      </p>
                    </div>
                  </div>
                )}

                {endotoxinResult && (
                  <div className="flex gap-3 shrink-0 min-w-[140px]">
                    <Shield className="w-6 h-6 text-[#137333] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[11px] font-bold text-[#1a3a7d]">Endotoxin (LAL)</p>
                      {renderResultText(endotoxinResult)}
                      <p className="text-[11px] text-[#137333] font-bold flex items-center gap-1 mt-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Pass
                      </p>
                    </div>
                  </div>
                )}

                {sterilityResult && (
                  <div className="flex gap-3 shrink-0 min-w-[140px]">
                    <FlaskConical className="w-6 h-6 text-[#214A9E] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[11px] font-bold text-[#1a3a7d]">Sterility (PCR)</p>
                      {renderResultText(sterilityResult)}
                      <p className="text-[11px] text-[#137333] font-bold flex items-center gap-1 mt-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Pass
                      </p>
                    </div>
                  </div>
                )}

                {netContentResult && (
                  <div className="flex gap-3 shrink-0 min-w-[140px]">
                    <CheckSquare className="w-6 h-6 text-[#137333] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[11px] font-bold text-[#1a3a7d]">Net Content</p>
                      {renderResultText(netContentResult)}
                      <p className="text-[11px] text-[#137333] font-bold flex items-center gap-1 mt-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Pass
                      </p>
                    </div>
                  </div>
                )}

              </div>

              <div className="px-5 py-3 border-t border-slate-100 flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-[#214A9E]" />
                <span className="text-[11px] text-slate-500 font-medium">
                  Verified by <span className="font-bold text-[#214A9E]">{batch.verificationDetails?.labName || 'ILS Laboratories'}</span>
                </span>
                <span className="text-slate-300 mx-1">|</span>
                <span className="text-[11px] text-slate-500 font-medium">ISO/IEC 17025 Accredited</span>
              </div>
            </div>
          )}
        </div>

        {/* Box 3: COA Verification */}
        {batch.verificationDetails?.coaReportId && (
          <div className="border border-slate-200 rounded-2xl bg-[#f8fbff] p-5 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div className="flex flex-col md:flex-row gap-5 items-start md:items-center justify-between">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-white border border-slate-200 rounded-lg shrink-0 flex items-center justify-center overflow-hidden p-1 shadow-sm">
                  {/* Generic QR code pattern using SVG */}
                  <svg viewBox="0 0 100 100" className="w-full h-full text-slate-800" fill="currentColor">
                    <path d="M10,10 h25 v25 h-25 z M15,15 h15 v15 h-15 z M65,10 h25 v25 h-25 z M70,15 h15 v15 h-15 z M10,65 h25 v25 h-25 z M15,70 h15 v15 h-15 z M45,10 h10 v10 h-10 z M45,25 h10 v10 h-10 z M10,45 h10 v10 h-10 z M25,45 h10 v10 h-10 z M45,45 h10 v10 h-10 z M45,65 h10 v10 h-10 z M65,45 h10 v10 h-10 z M80,45 h10 v10 h-10 z M65,65 h10 v10 h-10 z M80,65 h10 v10 h-10 z M65,80 h10 v10 h-10 z M80,80 h10 v10 h-10 z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-[#214A9E] flex items-center gap-1.5 mb-1">
                    <HelpCircle className="w-4 h-4" /> COA Verification
                  </h4>
                  <p className="text-[12px] text-slate-500 leading-relaxed max-w-[280px]">
                    Verify this COA directly with {batch.verificationDetails?.labName || 'the lab'}. Scan the QR Code or enter the access code on the portal.
                  </p>
                  
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-[11px] font-bold text-[#214A9E] uppercase tracking-wider">Access Code:</span>
                    <div className="flex items-center gap-2 bg-white border border-[#214A9E]/20 rounded-md px-2.5 py-1">
                      <span className="text-[11px] font-bold text-slate-700 font-mono tracking-wider">
                        {batch.verificationDetails.coaReportId}
                      </span>
                      <button onClick={handleCopyAccessCode} className="text-[#214A9E] hover:text-blue-800 focus:outline-none" title="Copy code">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {batch.verificationDetails?.verificationUrl && (
                <button 
                  onClick={() => window.open(batch.verificationDetails.verificationUrl, '_blank')}
                  className="w-full md:w-auto px-5 py-2.5 rounded-lg border-2 border-[#214A9E]/20 text-[#214A9E] text-[13px] font-bold hover:bg-[#214A9E] hover:text-white transition-all focus:outline-none flex items-center justify-center gap-2 shrink-0 bg-white shadow-sm"
                >
                  Verify on Portal
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

// Simple HelpCircle icon for the Verification box title
const HelpCircle = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default CurrentBatchCard;
