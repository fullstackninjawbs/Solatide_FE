import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { FileText, CheckCircle2, ShieldCheck, Copy, ExternalLink, FlaskConical, Hourglass, ChevronRight, Check } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import purityIcon from '../../assets/icons/purity.svg';
import identityIcon from '../../assets/icons/identity.svg';
import netPeptideIcon from '../../assets/icons/net_peptide.svg';
import fentanylScreenIcon from '../../assets/icons/fentanyl_screen.svg';
import heavyMetalIcon from '../../assets/icons/heavy_metal.svg';
import microbialIcon from '../../assets/icons/microbial.svg';
import endotoxinIcon from '../../assets/icons/endotoxin.svg';

const CurrentBatchCard = ({ batch, product }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleOpenCoa = () => {
    const url = batch?.coaFile?.url || batch?.coaUrl;
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleCopyAccessCode = async () => {
    if (batch?.verificationDetails?.coaReportId) {
      try {
        await navigator.clipboard.writeText(batch.verificationDetails.coaReportId);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

  const isMissingOrInactive = !batch || batch?.status === 'inactive';
  const tests = isMissingOrInactive ? {} : (batch.tests || {});




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

  // Tests shown in the summary grid (same order and labels as before)
  const qcTests = [
    hasPurity && { key: 'purity', label: 'Purity', method: 'HPLC', icon: purityIcon, result: purityResult },
    hasIdentity && { key: 'identity', label: 'Identity', method: 'LC-MS', icon: identityIcon, result: identityResult },
    hasNetContent && { key: 'net', label: 'Net Peptide Content', icon: netPeptideIcon, result: netContentResult },
    hasFentanyl && { key: 'fentanyl', label: 'Fentanyl Screen', method: 'Safety screen', icon: fentanylScreenIcon, result: fentanylResult },
    hasHeavyMetals && { key: 'metals', label: 'Heavy Metals', method: 'ICP-MS', icon: heavyMetalIcon, result: heavyMetalsResult },
    hasSterility && { key: 'sterility', label: 'Microbial / Sterility', icon: microbialIcon, result: sterilityResult },
    hasEndotoxin && { key: 'endotoxin', label: 'Endotoxin', method: 'USP <85>', icon: endotoxinIcon, result: endotoxinResult },
  ].filter(Boolean);
  // Empty slots needed to complete the last row (2 columns on phones, 3 from md)
  const fillTwoCol = qcTests.length % 2;
  const fillThreeCol = (3 - (qcTests.length % 3)) % 3;

  const showPendingResultsSection = product?.showPendingResultsSection ?? true;
  const isBacteriostaticWater = product?.name?.toLowerCase().includes('bacteriostatic water');

  if (!hasQcData) {
    if (!showPendingResultsSection || isBacteriostaticWater) {
      return null;
    }

    return (
      <div className="flex flex-col gap-3 mb-4 mt-2 font-['Poppins','Poppins_Fallback',sans-serif]">

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
    <div className="text-left font-['Poppins','Poppins_Fallback',sans-serif]">
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
                    <p className="text-[13px] text-slate-500 mt-0.5">Includes: HPLC Purity Net content</p>
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
            <div className="mx-4 mb-4 border border-slate-100 rounded-xl bg-white shadow-sm">
              <div className="px-5 py-3 border-b border-slate-100 rounded-t-xl">
                <h5 className="text-[12px] font-bold text-[#1a3a7d] mb-0">Test Summary</h5>
              </div>

              {/* Equal-height cards: gap-px on a tinted grid draws even dividers for any number of
                  tests; "Pass" sits on the same bottom line in every card of a row; empty slots in
                  the last row are filled so no divider is left hanging. */}
              <div className="grid grid-cols-2 md:grid-cols-3 auto-rows-fr gap-px bg-slate-100">
                {qcTests.map((t) => (
                  <div key={t.key} className="flex flex-col sm:flex-row gap-2 sm:gap-3 p-3.5 sm:p-4 bg-white min-w-0">
                    <img src={t.icon} alt="" aria-hidden="true" className="w-[34px] h-[34px] sm:w-[44px] sm:h-[44px] shrink-0 object-contain" />
                    <div className="flex flex-col flex-1 min-w-0">
                      <p className="text-[11.5px] font-bold text-[#1a3a7d] leading-tight line-clamp-2" title={t.label}>{t.label}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5 h-[15px] leading-[15px] truncate">{t.method || ' '}</p>
                      <ResultText text={t.result} />
                      <p className="mt-auto pt-1.5 text-[11px] text-[#137333] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" /> Pass
                      </p>
                    </div>
                  </div>
                ))}
                {Array.from({ length: Math.max(fillTwoCol, fillThreeCol) }).map((_, i) => (
                  <div
                    key={`fill-${i}`}
                    aria-hidden="true"
                    className={`bg-white ${i < fillTwoCol ? 'block' : 'hidden'} ${i < fillThreeCol ? 'md:block' : 'md:hidden'}`}
                  />
                ))}
              </div>

              <div className="px-5 py-3 border-t border-slate-100 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                  <FlaskConical className="w-4 h-4 text-[#214A9E] shrink-0" aria-hidden="true" />
                  <span>Verified by <span className="font-bold text-[#214A9E]">{batch.verificationDetails?.labName || 'ILS Laboratories'}</span></span>
                </span>
                <span className="hidden min-[420px]:inline text-slate-300" aria-hidden="true">|</span>
                <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">ISO/IEC 17025 Accredited</span>
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
                        {isCopied ? (
                          <Check className="w-3.5 h-3.5 text-green-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1a3a7d] transition-colors" />
                        )}
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


/**
 * One-line test result. Long values end with "…" and the full text shows in a small tooltip on
 * hover, keyboard focus or tap (phones have no hover), so every test card keeps the same size.
 * "a | b" or two-line values show "a" with "b" in the tooltip. The line is reserved even when
 * there is no result, so cards in different rows line up too.
 */
const ResultText = ({ text }) => {
  const ref = useRef(null);
  const [truncated, setTruncated] = useState(false);
  const [open, setOpen] = useState(false);
  // Same separators as before: a literal "\n" typed in the admin, a real line break, or "|"
  const parts = text ? String(text).split(/\\n|\n|\|/).map((x) => x.trim()).filter(Boolean) : [];
  const main = parts[0] || '';
  const full = parts.join(' · ');
  const hasMore = parts.length > 1 || truncated;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const check = () => setTruncated(el.scrollWidth > el.clientWidth + 1);
    check();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [main]);

  // Close a tapped-open tooltip when tapping anywhere else
  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => { if (!ref.current?.parentElement?.contains(e.target)) setOpen(false); };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [open]);

  if (!main) return <div className="h-[18px] mt-1" aria-hidden="true" />;

  return (
    <div
      className="relative mt-1 h-[18px] group/result"
      onMouseEnter={() => hasMore && setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <span
        ref={ref}
        tabIndex={hasMore ? 0 : undefined}
        role={hasMore ? 'button' : undefined}
        aria-label={hasMore ? full : undefined}
        // A tap fires focus and then click: both only open (tapping elsewhere or blur closes it)
        onClick={() => hasMore && setOpen(true)}
        onKeyDown={(e) => { if (hasMore && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); setOpen((v) => !v); } if (e.key === 'Escape') setOpen(false); }}
        onFocus={() => hasMore && setOpen(true)}
        onBlur={() => setOpen(false)}
        className={`block truncate text-[12px] leading-[18px] text-[#1a3a7d] ${hasMore ? 'cursor-help underline decoration-dotted decoration-slate-300 underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 rounded-sm' : ''}`}
      >
        {main}
      </span>
      {hasMore && open && (
        <span
          role="tooltip"
          className="absolute left-0 bottom-full mb-1.5 z-20 w-max max-w-[220px] rounded-lg bg-slate-900 px-2.5 py-1.5 text-[11.5px] leading-snug text-white shadow-lg whitespace-normal break-words pointer-events-none"
        >
          {full}
        </span>
      )}
    </div>
  );
};

export default CurrentBatchCard;
