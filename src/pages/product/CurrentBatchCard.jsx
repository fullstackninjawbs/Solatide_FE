import React from 'react';
import { FileText, CheckCircle2, ShieldCheck, Copy, ExternalLink, QrCode, BarChart2, Droplet, FlaskConical, CheckSquare, Shield, Hourglass, HelpCircle, ChevronRight } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const CurrentBatchCard = ({ batch, product }) => {
  const handleOpenCoa = () => {
    const url = batch?.coaFile?.url || batch?.coaUrl;
    if (url) {
      window.open(url, '_blank');
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

  const purityResult = tests.purityHplc?.result || '';
  const identityResult = tests.identityHplc?.result || '';
  const fentanylResult = tests.fentanylScreen?.result || '';
  const endotoxinResult = tests.endotoxinUsp85?.result || '';
  const sterilityResult = tests.sterilityPcr?.result || '';
  const netContentResult = tests.netPeptideContent?.result || '';
  const heavyMetalsResult = tests.heavyMetalsIcpMs?.result || '';

  const hasPurity = tests.purityHplc?.performed;
  const hasIdentity = tests.identityHplc?.performed;
  const hasFentanyl = tests.fentanylScreen?.performed;
  const hasEndotoxin = tests.endotoxinUsp85?.performed;
  const hasSterility = tests.sterilityPcr?.performed;
  const hasNetContent = tests.netPeptideContent?.performed;
  const hasHeavyMetals = tests.heavyMetalsIcpMs?.performed;

  const hasQcData = hasPurity || hasIdentity || hasFentanyl || hasEndotoxin || hasSterility || hasNetContent || hasHeavyMetals;

  // Check if all required tests for "Full QC" are present (supporting both variants)
  const isFullQcVariant1 = hasPurity && hasIdentity && hasEndotoxin && hasHeavyMetals && hasSterility;
  const isFullQcVariant2 = hasPurity && hasIdentity && hasFentanyl && hasEndotoxin && hasSterility && hasNetContent;
  const isFullQc = isFullQcVariant1 || isFullQcVariant2;

  const isPartialQc = hasQcData && !isFullQc;
  const completedTestsCount = [hasPurity, hasIdentity, hasFentanyl, hasEndotoxin, hasSterility, hasNetContent, hasHeavyMetals].filter(Boolean).length;

  if (!hasQcData) {

    return (
      <div className="flex flex-col gap-3 mb-4 mt-2 font-['Poppins']">

        {/* Manufacturer QC Card */}
        <div className="border border-[#E7F3EB] rounded-lg bg-[#F8FCF9] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
          <div className="flex gap-4">
            <div className="shrink-0 mt-0.5">
              <ShieldCheck className="w-[30px] h-[30px] text-[#137333]" strokeWidth={1.8} />
            </div>
            <div className="flex flex-col gap-2.5">
              <h4 className="text-[17px] font-bold text-[#137333] tracking-tight">Full manufacturer QC panel completed</h4>
              <div className="flex flex-col gap-1.5 mt-0.5">
                <p className="text-[13.5px] text-[#2F3A4B] font-medium leading-relaxed">Each batch undergoes a full manufacturer QC panel prior to release.</p>
                <p className="text-[13.5px] text-[#2F3A4B] font-medium leading-relaxed">Manufacturer QC confirms batch release against internal quality specifications.</p>
                <p className="text-[13.5px] text-[#2F3A4B] font-medium leading-relaxed">Detailed manufacturer QC results are not publicly displayed.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Third-Party Testing Card */}
        <div className="border border-[#FDEAE0] rounded-lg bg-[#FFF9F2] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
          <div className="flex gap-4">
            <div className="shrink-0 mt-0.5">
              <Hourglass className="w-[30px] h-[30px] text-[#F97316]" strokeWidth={1.8} />
            </div>
            <div className="flex flex-col gap-2.5">
              <h4 className="text-[17px] font-bold text-[#F97316] tracking-tight">Third-party testing in progress</h4>
              <div className="flex flex-col gap-1.5 mt-0.5">
                <p className="text-[13.5px] text-[#2F3A4B] font-medium leading-relaxed">Additional third-party testing is currently in progress for this batch.</p>
                <p className="text-[13.5px] text-[#2F3A4B] font-medium leading-relaxed">Verified third-party results will be published here once available.</p>
              </div>
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

        {/* Box 1: Batch Header & Links */}
        <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
            <span className="text-[16px] font-bold text-slate-900">{batch.batchId || 'N/A'}</span>
            {batch.coaStatus === 'approved' ? (
              <span className="bg-[#E6F4EA] text-[#137333] text-[11px] font-bold px-3 py-1 rounded-full tracking-wide">
                Now Shipping
              </span>
            ) : (
              <span className="bg-[#FFF3E0] text-[#C05621] text-[11px] font-bold px-3 py-1 rounded-full tracking-wide">
                Pending Documentation
              </span>
            )}
          </div>

          {/* Links */}
          <div className="flex flex-col">
            {(batch.coaFile?.url || batch.coaUrl) && (
              <button onClick={handleOpenCoa} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors text-left group">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-[15px] font-bold text-brand-navy group-hover:text-blue-600 transition-colors">View current batch COA</h5>
                    <p className="text-[13px] text-slate-500 mt-0.5">Includes: HPLC Purity · Net content</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </button>
            )}

            {batch.endotoxinReportUrl && (
              <a href={batch.endotoxinReportUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-5 py-4 border-t border-slate-100 hover:bg-slate-50 transition-colors text-left group">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <FlaskConical className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-[15px] font-bold text-brand-navy group-hover:text-blue-600 transition-colors">View endotoxin report</h5>
                    <p className="text-[13px] text-slate-500 mt-0.5">Batch-specific endotoxin analysis report</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </a>
            )}
          </div>
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
                  <h4 className="text-[15px] font-bold text-[#C05621]">This batch has third party test results</h4>
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

                {hasPurity && (
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

                {hasIdentity && (
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

                {hasFentanyl && (
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

                {hasEndotoxin && (
                  <div className="flex gap-3 shrink-0 min-w-[140px]">
                    <Shield className="w-6 h-6 text-[#137333] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[11px] font-bold text-[#1a3a7d]">Endotoxin</p>
                      {renderResultText(endotoxinResult)}
                      <p className="text-[11px] text-[#137333] font-bold flex items-center gap-1 mt-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Pass
                      </p>
                    </div>
                  </div>
                )}

                {hasSterility && (
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

                {hasNetContent && (
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

                {hasHeavyMetals && (
                  <div className="flex gap-3 shrink-0 min-w-[140px]">
                    <Hourglass className="w-6 h-6 text-[#137333] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[11px] font-bold text-[#1a3a7d]">Heavy Metals (ICP-MS)</p>
                      {renderResultText(heavyMetalsResult)}
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
        {batch.verificationDetails?.verificationUrl && (
          <div className="border border-slate-100 rounded-2xl bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

              <div className="flex flex-col">
                <h4 className="text-[13.5px] font-bold text-[#1a3a7d] flex items-center gap-1.5 mb-3">
                  <HelpCircle className="w-4 h-4 text-[#1a3a7d]" /> COA Verification
                </h4>

                <div className="flex items-start gap-4">
                  <div className="w-[78px] h-[78px] bg-white border border-slate-200 rounded-lg shrink-0 flex items-center justify-center p-1.5 shadow-sm">
                    <QRCodeSVG
                      value={batch.verificationDetails.verificationUrl}
                      size={66}
                      level="L"
                      includeMargin={false}
                      fgColor="#1e293b"
                    />
                  </div>

                  <div className="flex flex-col justify-center mt-0.5">
                    <p className="text-[12px] text-slate-500 leading-snug max-w-[280px]">
                      Verify this COA directly with {batch.verificationDetails?.labName || 'the lab'}.<br />
                      Scan the QR code{batch.verificationDetails?.coaReportId ? ' or enter the access code' : ''}<br />
                      on the {batch.verificationDetails?.labName || 'lab'} portal to verify this COA.
                    </p>

                    {batch.verificationDetails?.coaReportId && (
                      <div className="flex items-center gap-2 mt-2.5">
                        <span className="text-[11.5px] font-bold text-[#214A9E]">Access Code:</span>
                        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-full px-2.5 py-0.5">
                          <span className="text-[11px] font-bold text-slate-800 tracking-wide font-mono">
                            {batch.verificationDetails.coaReportId}
                          </span>
                          <button onClick={handleCopyAccessCode} className="text-slate-500 hover:text-slate-800 focus:outline-none transition-colors" title="Copy code">
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => window.open(batch.verificationDetails.verificationUrl, '_blank')}
                className="w-full md:w-auto px-6 py-2.5 rounded-xl border border-blue-600 text-blue-600 text-[13px] font-bold hover:bg-blue-50 transition-all focus:outline-none flex items-center justify-center gap-2 shrink-0 bg-white shadow-sm"
              >
                Verify on {batch.verificationDetails.labName || 'Portal'}
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};



export default CurrentBatchCard;
