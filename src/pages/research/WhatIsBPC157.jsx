import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const WhatIsBPC157 = () => {
    return (
        <div className="min-h-screen bg-white font-sans">
            <Helmet>
                <title>What Is BPC-157? | Research Peptide Guide | Solatide Biosciences</title>
                <meta name="description" content="BPC-157 is a synthetic pentadecapeptide studied in laboratory settings for tissue-response mechanisms, angiogenesis-related signalling, and cellular repair pathways. For in-vitro research use only." />
                <link rel="canonical" href="https://solatidebiosciences.com.au/pages/what-is-bpc-157" />
            </Helmet>

            <section className="w-full py-4 text-center border-b border-slate-100 mb-10">
                <div className="main-container">
                    <h1 className="text-[48px] md:text-[46px] font-bold text-center text-[#214A9E] leading-tight">
                        What Is BPC-157?
                    </h1>
                </div>
            </section>

            <div className="main-container pb-16">
                <div className="bg-[#F0F5FB] border-l-[3px] border-[#1a4494] p-5 mb-10 rounded-[4px]">
                    <p className="text-[13.5px] text-slate-700 leading-relaxed">
                        <strong className="text-[#150F3A]">Research Use Only:</strong> All peptides and compounds discussed on this page are intended strictly for in-vitro laboratory research purposes only. Not for human consumption, medical treatment, or veterinary use.{' '}
                        <Link to="/pages/research-use-disclaimer" className="text-[#3390ec] hover:underline">Read our full disclaimer.</Link>
                    </p>
                </div>

                <div className="mb-10">
                    <h2 className="text-[18px] font-bold text-[#150F3A] mb-4 border-b border-slate-200 pb-2">Overview</h2>
                    <div className="space-y-4 text-[14px] text-slate-700 leading-[1.8]">
                        <p>BPC-157 is a synthetic peptide fragment commonly discussed in laboratory settings that examine tissue-response mechanisms, angiogenesis-related signalling, cellular migration, and experimental models of repair-associated pathways. Within the broader research-peptide landscape, it is usually grouped with compounds used to study how cells respond to injury-related or regeneration-oriented experimental conditions.</p>
                        <p>BPC-157 is a pentadecapeptide — a 15-amino-acid sequence — derived from a protective protein found in gastric juice. While the parent protein occurs naturally in the human body, BPC-157 itself is a laboratory-synthesised fragment designed to isolate specific sequence properties for research purposes.</p>
                        <p>Unlike metabolic peptides such as retatrutide, BPC-157 does not target incretin or glucagon receptors. Instead, it is examined for its potential effects on growth factor pathways, angiogenic signalling, and cellular repair cascades in laboratory models.</p>
                    </div>
                </div>

                <div className="mb-10">
                    <h2 className="text-[18px] font-bold text-[#150F3A] mb-4 border-b border-slate-200 pb-2">Mechanism and Research Context</h2>
                    <p className="text-[14px] text-slate-700 leading-[1.8]">Researchers study BPC-157 in contexts related to cellular repair mechanisms, tissue response pathways, and recovery-related signalling. Its appearance in experimental literature reflects interest in understanding how peptide sequences may influence cellular behaviour in injury models, migration studies, and tissue integrity investigations.</p>
                </div>

                <div className="mb-10">
                    <h2 className="text-[18px] font-bold text-[#150F3A] mb-4 border-b border-slate-200 pb-2">Research Applications</h2>
                    <div className="space-y-3">
                        {[
                            { title: 'Growth factor modulation', desc: 'Studies examine whether BPC-157 influences growth factor expression or receptor activity in cellular models, particularly factors associated with tissue repair and vascular development.' },
                            { title: 'Angiogenic signalling', desc: "Researchers investigate BPC-157's potential role in pathways related to blood vessel formation and endothelial cell behaviour in controlled experimental settings." },
                            { title: 'Cellular migration and proliferation', desc: 'Laboratory studies explore how BPC-157 may affect cell movement, division, and differentiation in tissue culture models and injury-response experiments.' },
                            { title: 'Nitric oxide pathways', desc: 'Some research examines potential interactions between BPC-157 and nitric oxide signalling systems, which play roles in vascular function and cellular communication.' },
                        ].map((item) => (
                            <div key={item.title} className="border border-[#E2E8F0] rounded-[8px] p-4 bg-white">
                                <p className="text-[14px] font-semibold text-[#214A9E] mb-1">{item.title}</p>
                                <p className="text-[13.5px] text-slate-600 leading-[1.7]">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-10">
                    <h2 className="text-[18px] font-bold text-[#150F3A] mb-4 border-b border-slate-200 pb-2">Key Characteristics</h2>
                    <ul className="list-disc pl-5 space-y-2 text-[14px] text-slate-700">
                        <li>Synthetic pentadecapeptide (15-amino-acid sequence)</li>
                        <li>Derived from gastric juice protective protein</li>
                        <li>Distinct from metabolic peptides — does not target incretin/glucagon receptors</li>
                        <li>Studied for growth factor and angiogenic pathway effects</li>
                        <li>Research-grade purity ≥99%</li>
                    </ul>
                </div>

                <div className="mb-10">
                    <h2 className="text-[18px] font-bold text-[#150F3A] mb-4 border-b border-slate-200 pb-2">Related Compounds and Comparisons</h2>
                    <div className="flex flex-wrap gap-3">
                        {[
                            { label: 'TB-500 10mg', to: '/products/tb-500-10mg' },
                            { label: 'BPC-157 vs TB-500', to: '/pages/bpc-157-vs-tb-500' },
                            { label: 'BPC-157 10mg', to: '/products/bpc-157-10mg' },
                            { label: 'Compound Index', to: '/pages/research-compound-database' },
                        ].map((link) => (
                            <Link key={link.to} to={link.to} className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] text-[#3390ec] hover:bg-slate-50 transition-colors">
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="mb-10">
                    <h2 className="text-[18px] font-bold text-[#150F3A] mb-4 border-b border-slate-200 pb-2">Quality and Documentation</h2>
                    <p className="text-[14px] text-slate-700 leading-[1.8]">
                        All BPC-157 products from Solatide Biosciences are independently third-party tested for purity and identity. Batch-specific Certificates of Analysis (COAs) are available for each product.{' '}
                        <Link to="/pages/coa-lab-testing" className="text-[#3390ec] hover:underline">Learn more about our COA &amp; lab testing process.</Link>
                    </p>
                </div>

                <div className="bg-[#F0F5FB] border-l-[3px] border-[#1a4494] p-5 rounded-[4px] mb-8">
                    <p className="text-[13.5px] text-slate-700 leading-relaxed">
                        <strong className="text-[#150F3A]">Research Use Only:</strong> All products are manufactured for in-vitro laboratory research and are not intended for human consumption, medical use, or veterinary applications.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WhatIsBPC157;
