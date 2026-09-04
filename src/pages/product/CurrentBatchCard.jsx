import React from 'react';
import { FileText, CheckCircle2, ShieldCheck, Copy, ExternalLink, QrCode, BarChart2, Droplet, FlaskConical, CheckSquare, Shield, Hourglass, HelpCircle, ChevronRight, Activity, CircleDot } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import purityIcon from '../../assets/icons/purity.svg';
import identityIcon from '../../assets/icons/identity.svg';
import netPeptideIcon from '../../assets/icons/net_peptide.svg';
import fentanylScreenIcon from '../../assets/icons/fentanyl_screen.svg';
import heavyMetalIcon from '../../assets/icons/heavy_metal.svg';
import microbialIcon from '../../assets/icons/microbial.svg';
import endotoxinIcon from '../../assets/icons/endotoxin.svg';

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
          <div className="text-[12px] text-[#1a3a7d]">{parts[0].trim()}</div>
          <div className="text-[11px] font-medium text-slate-400 mt-0.5">{parts.slice(1).join('\n').trim()}</div>
        </div>
      );
    }
    return <div className="text-[12px] text-[#1a3a7d] my-0.5 leading-snug">{text}</div>;
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

  const showPendingResultsSection = product?.showPendingResultsSection ?? true;
  const isBacteriostaticWater = product?.name?.toLowerCase().includes('bacteriostatic water');

  if (!hasQcData) {
    if (!showPendingResultsSection || isBacteriostaticWater) {
      return null;
    }

    return (
      <div className="flex flex-col gap-3 mb-4 mt-2 font-['Poppins']">

        {/* Manufacturer QC Card */}
        <div className="border border-[#E7F3EB] rounded-lg bg-[#F8FCF9] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
          <div className="flex gap-4">
            <div className="shrink-0 mt-0.5">
              <ShieldCheck className="w-[30px] h-[30px] text-[#137333]" strokeWidth={1.8} />
            </div>
            <div className="flex flex-col gap-2.5">
              <h4 className="text-[17px] font-bold text-[#137333] tracking-tight">Full Manufacturer QC Panel Passed</h4>
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
              <span className="bg-[#FFF3E0] text-[#137333] text-[11px] font-bold px-3 py-1 rounded-full tracking-wide">
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
                    <p className="text-[13px] text-slate-500 mt-0.5">Includes: HPLC Purity Â· Net content</p>
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
                <ShieldCheck className="w-6 h-6 text-[#137333] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[15px] font-bold text-[#137333]">This batch has third party test results</h4>
                </div>
              </div>
              <span className="bg-[#FFF3E0] text-[#137333] text-[10px] font-bold px-2.5 py-1 ml-2 rounded-md shrink-0 tracking-wide">
                {completedTestsCount} Test{completedTestsCount !== 1 ? 's' : ''} Available
              </span>
            </div>
          ) : null}

          {/* Test Summary Horizontal List (Only if hasQcData) */}
          {hasQcData && (
            <div className="mx-4 mb-4 border border-slate-100 rounded-xl overflow-hidden bg-white shadow-sm">
              <div className="px-5 py-3 border-b border-slate-100">
                <h5 className="text-[12px] font-bold text-[#1a3a7d] mb-0">Test Summary</h5>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 bg-white -mb-[1px] -mr-[1px]">
                {hasPurity && (
                  <div className="flex flex-col sm:flex-row gap-3 p-4 bg-white border-r border-b border-slate-100">
                    <img src={purityIcon} alt="Purity" className="w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] shrink-0 mt-0.5 object-contain" />
                    <div>
                      <p className="text-[11px] font-bold text-[#1a3a7d]">Purity</p>
                      {renderResultText(purityResult)}
                      <p className="text-[10px] text-slate-500 mt-0.5">HPLC</p>
                      <p className="text-[11px] text-[#137333] font-bold flex items-center gap-1 mt-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Pass
                      </p>
                    </div>
                  </div>
                )}

                {hasIdentity && (
                  <div className="flex flex-col sm:flex-row gap-3 p-4 bg-white border-r border-b border-slate-100">
                    <img src={identityIcon} alt="Identity" className="w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] shrink-0 mt-0.5 object-contain" />
                    <div>
                      <p className="text-[11px] font-bold text-[#1a3a7d]">Identity</p>
                      {renderResultText(identityResult)}
                      <p className="text-[10px] text-slate-500 mt-0.5">LC-MS</p>
                      <p className="text-[11px] text-[#137333] font-bold flex items-center gap-1 mt-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Pass
                      </p>
                    </div>
                  </div>
                )}

                {hasNetContent && (
                  <div className="flex flex-col sm:flex-row gap-3 p-4 bg-white border-r border-b border-slate-100">
                    <img src={netPeptideIcon} alt="Net Peptide Content" className="w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] shrink-0 mt-0.5 object-contain" />
                    <div>
                      <p className="text-[11px] font-bold text-[#1a3a7d]">Net Peptide Content</p>
                      {renderResultText(netContentResult)}
                      <p className="text-[11px] text-[#137333] font-bold flex items-center gap-1 mt-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Pass
                      </p>
                    </div>
                  </div>
                )}

                {hasFentanyl && (
                  <div className="flex flex-col sm:flex-row gap-3 p-4 bg-white border-r border-b border-slate-100">
                    <img src={fentanylScreenIcon} alt="Fentanyl Screen" className="w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] shrink-0 mt-0.5 object-contain" />
                    <div>
                      <p className="text-[11px] font-bold text-[#1a3a7d]">Fentanyl Screen</p>
                      {renderResultText(fentanylResult)}
                      <p className="text-[10px] text-slate-500 mt-0.5">Safety screen</p>
                      <p className="text-[11px] text-[#137333] font-bold flex items-center gap-1 mt-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Pass
                      </p>
                    </div>
                  </div>
                )}

                {hasHeavyMetals && (
                  <div className="flex flex-col sm:flex-row gap-3 p-4 bg-white border-r border-b border-slate-100">
                    <img src={heavyMetalIcon} alt="Heavy Metals" className="w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] shrink-0 mt-0.5 object-contain" />
                    <div>
                      <p className="text-[11px] font-bold text-[#1a3a7d]">Heavy Metals</p>
                      {renderResultText(heavyMetalsResult)}
                      <p className="text-[10px] text-slate-500 mt-0.5">ICP-MS</p>
                      <p className="text-[11px] text-[#137333] font-bold flex items-center gap-1 mt-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Pass
                      </p>
                    </div>
                  </div>
                )}

                {hasSterility && (
                  <div className="flex flex-col sm:flex-row gap-3 p-4 bg-white border-r border-b border-slate-100">
                    <img src={microbialIcon} alt="Microbial / Sterility" className="w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] shrink-0 mt-0.5 object-contain" />
                    <div>
                      <p className="text-[11px] font-bold text-[#1a3a7d]">Microbial / Sterility</p>
                      {renderResultText(sterilityResult)}
                      <p className="text-[11px] text-[#137333] font-bold flex items-center gap-1 mt-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Pass
                      </p>
                    </div>
                  </div>
                )}

                {hasEndotoxin && (
                  <div className="flex flex-col sm:flex-row gap-3 p-4 bg-white border-r border-b border-slate-100">
                    <img src={endotoxinIcon} alt="Endotoxin" className="w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] shrink-0 mt-0.5 object-contain" />
                    <div>
                      <p className="text-[11px] font-bold text-[#1a3a7d]">Endotoxin</p>
                      {renderResultText(endotoxinResult)}
                      <p className="text-[10px] text-slate-500 mt-0.5">USP &lt;85&gt;</p>
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
          <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-[0_2px_4px_rgba(0,0,0,0.02)] mt-1">
            <div className="bg-slate-50/80 border-b border-slate-100 px-5 py-3.5">
              <h4 className="text-[13px] font-bold text-[#1a3a7d] flex items-center gap-2 uppercase tracking-wide">
                <ShieldCheck className="w-4 h-4 text-[#1a3a7d]" /> Official COA Verification
              </h4>
            </div>
            <div className="p-5 flex flex-col gap-5">

              <div className="flex flex-col min-[400px]:flex-row items-center min-[400px]:items-start gap-4 sm:gap-5 text-center min-[400px]:text-left">
                <div className="w-[100px] h-[100px] bg-white border border-slate-200 rounded-xl shrink-0 flex items-center justify-center p-2 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                  <QRCodeSVG
                    value={batch.verificationDetails.verificationUrl}
                    size={100}
                    level="L"
                    includeMargin={false}
                    fgColor="#1a3a7d"
                  />
                </div>

                <div className="flex flex-col items-center min-[400px]:items-start">
                  <h5 className="text-[14px] font-bold text-slate-800 mb-1.5">
                    Independent Lab Verification
                  </h5>
                  <p className="text-[12.5px] text-slate-500 leading-relaxed max-w-[400px]">
                    Scan the QR code to verify this certificate directly on the {batch.verificationDetails?.labName || 'laboratory'} secure portal.
                  </p>

                  {batch.verificationDetails?.coaReportId && (
                    <div className="flex flex-col min-[400px]:flex-row items-center gap-2.5 mt-3.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Access Code</span>
                      <div
                        onClick={handleCopyAccessCode}
                        className="flex items-center gap-2 bg-[#F4F7FC] border border-slate-200 hover:border-slate-300 rounded-lg px-2.5 py-1 cursor-pointer transition-colors group"
                        title="Click to copy"
                      >
                        <span className="text-[12px] font-bold text-[#1a3a7d] font-mono tracking-wide">
                          {batch.verificationDetails.coaReportId}
                        </span>
                        <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1a3a7d] transition-colors" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full pt-1">
                <button
                  onClick={() => window.open(batch.verificationDetails.verificationUrl, '_blank')}
                  className="w-full px-6 py-3 rounded-xl bg-[#1a3a7d] text-white text-[13px] font-bold hover:bg-[#122859] transition-all focus:outline-none flex items-center justify-center gap-2 shadow-sm"
                >
                  Verify on {batch.verificationDetails.labName || 'Portal'}
                  <ExternalLink className="w-4 h-4 opacity-80" />
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};



export default CurrentBatchCard;
