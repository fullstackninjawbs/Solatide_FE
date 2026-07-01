import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ProductInfoSection = ({ product }) => {
    const [openItems, setOpenItems] = useState({
        'Product Overview': true,
        'Technical Specifications': false,
        'Research Applications': false,
        'Third-party Batch Verification': false,
        'Batch Documentation Available': false,
        'Fast international dispatch': false,
        'Tracking Provided After Dispatch': false,
        'Support via Telegram and Email': false
    });

    const toggleAccordion = (item) => {
        setOpenItems(prev => ({
            ...prev,
            [item]: !prev[item]
        }));
    };

    return (
        <div className="mt-20 max-w-[1440px] mx-auto text-left" style={{ fontFamily: 'Poppins' }}>
            <h2 className="text-3xl font-semibold text-[#1E1E1E] text-center mb-12">
                Product information
            </h2>

            {/* Category: Specification & Application */}
            <div className="mb-10">
                <h3 className="text-[14px] font-bold text-[#214A9E] uppercase tracking-wider mb-5">
                    Specification & Application
                </h3>
                <div className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm flex flex-col">
                    {/* Accordion 1: Product Overview */}
                    <div className={`border-b border-slate-100 bg-white transition-all last:border-0 ${openItems['Product Overview'] ? 'bg-slate-50' : ''}`}>
                        <button
                            onClick={() => toggleAccordion('Product Overview')}
                            className={`w-full flex items-center justify-between px-6 py-5 font-semibold text-[15px] transition-colors ${openItems['Product Overview'] ? 'text-[#214A9E]' : 'text-[#1E1E1E] hover:text-[#214A9E]'}`}
                        >
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span>Product Overview</span>
                            </div>
                            <svg className={`w-4 h-4 transition-transform duration-200 ${openItems['Product Overview'] ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        </button>
                        {openItems['Product Overview'] && (
                            <div className="px-6 pb-6 pt-1 text-[14.5px] text-[#6A6A6A] leading-[1.7]">
                                <p className="flex items-start gap-3 mb-4">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#214A9E] mt-[9px] shrink-0"></span>
                                    <span>
                                        {product.name} is a high-grade research compound. Products selected for website presentation meet Solatide Biosciences' ≥99% purity standard based on available third-party documentation. This multi-receptor activation profile makes it a valuable research tool for investigating coordinated metabolic signalling, receptor crosstalk, and integrated pathway regulation in laboratory models.
                                    </span>
                                </p>
                                <div className="text-[13px] font-medium text-slate-400 mt-2 flex flex-wrap gap-2.5 items-center">
                                    <span>Related:</span>
                                    <Link to="/shop" className="text-[#0ea5e9] hover:underline">GLP-1 & Metabolic Peptides</Link>
                                    <span className="text-slate-300">|</span>
                                    <Link to="/about" className="text-[#0ea5e9] hover:underline">Research Guide</Link>
                                    <span className="text-slate-300">|</span>
                                    <Link to="/shop" className="text-[#0ea5e9] hover:underline">Research Overview</Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Accordion 2: Technical Specifications */}
                    <div className={`border-b border-slate-100 bg-white transition-all last:border-0 ${openItems['Technical Specifications'] ? 'bg-slate-50' : ''}`}>
                        <button
                            onClick={() => toggleAccordion('Technical Specifications')}
                            className={`w-full flex items-center justify-between px-6 py-5 font-semibold text-[15px] transition-colors ${openItems['Technical Specifications'] ? 'text-[#214A9E]' : 'text-[#1E1E1E] hover:text-[#214A9E]'}`}
                        >
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                                <span>Technical Specifications</span>
                            </div>
                            <svg className={`w-4 h-4 transition-transform duration-200 ${openItems['Technical Specifications'] ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        </button>
                        {openItems['Technical Specifications'] && (
                            <div className="px-6 pb-6 pt-1 text-[14.5px] text-[#6A6A6A] leading-[1.7]">
                                <p className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#214A9E] mt-[9px] shrink-0"></span>
                                    <span>
                                        Purity standard minimum of 99% verified via independent high-performance liquid chromatography (HPLC) and mass spectrometry analysis. Product is supplied as a sterile lyophilised white powder and must be stored at -20°C for long-term stability.
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Accordion 3: Research Applications */}
                    <div className={`border-b border-slate-100 bg-white transition-all last:border-0 ${openItems['Research Applications'] ? 'bg-slate-50' : ''}`}>
                        <button
                            onClick={() => toggleAccordion('Research Applications')}
                            className={`w-full flex items-center justify-between px-6 py-5 font-semibold text-[15px] transition-colors ${openItems['Research Applications'] ? 'text-[#214A9E]' : 'text-[#1E1E1E] hover:text-[#214A9E]'}`}
                        >
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                                <span>Research Applications</span>
                            </div>
                            <svg className={`w-4 h-4 transition-transform duration-200 ${openItems['Research Applications'] ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        </button>
                        {openItems['Research Applications'] && (
                            <div className="px-6 pb-6 pt-1 text-[14.5px] text-[#6A6A6A] leading-[1.7]">
                                <p className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#214A9E] mt-[9px] shrink-0"></span>
                                    <span>
                                        For in-vitro research use only. This compound is studied extensively in receptor activation kinetics, signaling pathway dynamics, metabolic pathways, and tissue cellular interactions in lab-controlled models.
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Category: Trust & Documentation */}
            <div className="mb-10">
                <h3 className="text-[14px] font-bold text-[#214A9E] uppercase tracking-wider mb-5">
                    Trust & Documentation
                </h3>
                <div className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm flex flex-col">
                    {/* Accordion 4: Third-party Batch Verification */}
                    <div className={`border-b border-slate-100 bg-white transition-all last:border-0 ${openItems['Third-party Batch Verification'] ? 'bg-slate-50' : ''}`}>
                        <button
                            onClick={() => toggleAccordion('Third-party Batch Verification')}
                            className={`w-full flex items-center justify-between px-6 py-5 font-semibold text-[15px] transition-colors ${openItems['Third-party Batch Verification'] ? 'text-[#214A9E]' : 'text-[#1E1E1E] hover:text-[#214A9E]'}`}
                        >
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <span>Third-party Batch Verification</span>
                            </div>
                            <svg className={`w-4 h-4 transition-transform duration-200 ${openItems['Third-party Batch Verification'] ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        </button>
                        {openItems['Third-party Batch Verification'] && (
                            <div className="px-6 pb-6 pt-1 text-[14.5px] text-[#6A6A6A] leading-[1.7]">
                                <p className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#214A9E] mt-[9px] shrink-0"></span>
                                    <span>
                                        Every batch is analyzed independently by third-party testing laboratories. HPLC/MS assays guarantee absolute identity, formulation consistency, and purity values.
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Accordion 5: Batch Documentation Available */}
                    <div className={`border-b border-slate-100 bg-white transition-all last:border-0 ${openItems['Batch Documentation Available'] ? 'bg-slate-50' : ''}`}>
                        <button
                            onClick={() => toggleAccordion('Batch Documentation Available')}
                            className={`w-full flex items-center justify-between px-6 py-5 font-semibold text-[15px] transition-colors ${openItems['Batch Documentation Available'] ? 'text-[#214A9E]' : 'text-[#1E1E1E] hover:text-[#214A9E]'}`}
                        >
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                                </svg>
                                <span>Batch Documentation Available</span>
                            </div>
                            <svg className={`w-4 h-4 transition-transform duration-200 ${openItems['Batch Documentation Available'] ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        </button>
                        {openItems['Batch Documentation Available'] && (
                            <div className="px-6 pb-6 pt-1 text-[14.5px] text-[#6A6A6A] leading-[1.7]">
                                <p className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#214A9E] mt-[9px] shrink-0"></span>
                                    <span>
                                        Certificates of Analysis (COA) and spectral reports are recorded and matching documentation is supplied with every transaction to ensure transparent lab compliance.
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Accordion 6: Fast international dispatch */}
                    <div className={`border-b border-slate-100 bg-white transition-all last:border-0 ${openItems['Fast international dispatch'] ? 'bg-slate-50' : ''}`}>
                        <button
                            onClick={() => toggleAccordion('Fast international dispatch')}
                            className={`w-full flex items-center justify-between px-6 py-5 font-semibold text-[15px] transition-colors ${openItems['Fast international dispatch'] ? 'text-[#214A9E]' : 'text-[#1E1E1E] hover:text-[#214A9E]'}`}
                        >
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5A2.5 2.5 0 0019 9.5V8a2 2 0 00-2-2h-3.172a2 2 0 00-1.414-.586L10 5.414A2 2 0 008.586 5H8M12 21a9 9 0 100-18 9 9 0 000 18z" />
                                </svg>
                                <span>Fast international dispatch</span>
                            </div>
                            <svg className={`w-4 h-4 transition-transform duration-200 ${openItems['Fast international dispatch'] ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        </button>
                        {openItems['Fast international dispatch'] && (
                            <div className="px-6 pb-6 pt-1 text-[14.5px] text-[#6A6A6A] leading-[1.7]">
                                <p className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#214A9E] mt-[9px] shrink-0"></span>
                                    <span>
                                        Orders are dispatched globally via express priority couriers with protective, temperature-managed packaging layers.
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Accordion 7: Tracking Provided After Dispatch */}
                    <div className={`border-b border-slate-100 bg-white transition-all last:border-0 ${openItems['Tracking Provided After Dispatch'] ? 'bg-slate-50' : ''}`}>
                        <button
                            onClick={() => toggleAccordion('Tracking Provided After Dispatch')}
                            className={`w-full flex items-center justify-between px-6 py-5 font-semibold text-[15px] transition-colors ${openItems['Tracking Provided After Dispatch'] ? 'text-[#214A9E]' : 'text-[#1E1E1E] hover:text-[#214A9E]'}`}
                        >
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                                </svg>
                                <span>Tracking Provided After Dispatch</span>
                            </div>
                            <svg className={`w-4 h-4 transition-transform duration-200 ${openItems['Tracking Provided After Dispatch'] ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        </button>
                        {openItems['Tracking Provided After Dispatch'] && (
                            <div className="px-6 pb-6 pt-1 text-[14.5px] text-[#6A6A6A] leading-[1.7]">
                                <p className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#214A9E] mt-[9px] shrink-0"></span>
                                    <span>
                                        Tracking coordinates are generated and sent immediately upon package collection to let you follow transit progress step-by-step.
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Accordion 8: Support via Telegram and Email */}
                    <div className={`border-b border-slate-100 bg-white transition-all last:border-0 ${openItems['Support via Telegram and Email'] ? 'bg-slate-50' : ''}`}>
                        <button
                            onClick={() => toggleAccordion('Support via Telegram and Email')}
                            className={`w-full flex items-center justify-between px-6 py-5 font-semibold text-[15px] transition-colors ${openItems['Support via Telegram and Email'] ? 'text-[#214A9E]' : 'text-[#1E1E1E] hover:text-[#214A9E]'}`}
                        >
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <span>Support via Telegram and Email</span>
                            </div>
                            <svg className={`w-4 h-4 transition-transform duration-200 ${openItems['Support via Telegram and Email'] ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        </button>
                        {openItems['Support via Telegram and Email'] && (
                            <div className="px-6 pb-6 pt-1 text-[14.5px] text-[#6A6A6A] leading-[1.7]">
                                <p className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#214A9E] mt-[9px] shrink-0"></span>
                                    <span>
                                        For questions, custom volume discounts, or document verifications, contact our support team at any time via Telegram or email.
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Research Compliance Notice */}
            <div className="mt-12 bg-[#edf4ff]/20 border border-[#214A9E]/10 rounded-xl p-5 text-[13.5px] leading-relaxed text-[#214A9E]/90 flex items-start gap-3">
                <span className="text-[16px] leading-none select-none">⚠️</span>
                <p>
                    <span className="font-bold">RESEARCH COMPLIANCE NOTICE:</span> Customer reviews are independent, user-generated content and do not reflect Solatide Biosciences' analytical research standards. All products are supplied strictly for in-vitro laboratory research only and are not for human or veterinary consumption.
                </p>
            </div>
        </div>
    );
};

export default ProductInfoSection;
