import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const researchApps = [
    { title: 'Matrix metalloproteinase modulation', desc: 'Studies examine how GHK-Cu influences matrix metalloproteinases (MMPs) and tissue inhibitors of metalloproteinases (TIMPs) in cellular models.' },
    { title: 'Collagen synthesis', desc: "Researchers investigate GHK-Cu's potential effects on collagen production and deposition in fibroblast cultures." },
    { title: 'Growth factor modulation', desc: 'Laboratory studies explore whether GHK-Cu affects growth factor expression or receptor activity in dermal cell systems.' },
    { title: 'Antioxidant effects', desc: 'Some research examines potential antioxidant properties of GHK-Cu in cellular systems.' },
    { title: 'Cellular differentiation', desc: 'Studies investigate how GHK-Cu may influence stem cell differentiation, fibroblast behaviour, and keratinocyte function in vitro.' },
];

const WhatIsGHKCu = () => (
    <div className="min-h-screen bg-white font-sans">
        <Helmet>
            <title>What Is GHK-Cu? | Copper Peptide Research | Solatide Biosciences</title>
            <meta name="description" content="GHK-Cu is a copper peptide studied in laboratory settings for dermal biology, extracellular matrix remodelling, and collagen synthesis. For in-vitro research use only." />
            <link rel="canonical" href="https://solatidebiosciences.com.au/pages/what-is-ghk-cu" />
        </Helmet>
        <section className="w-full py-4 text-center border-b border-slate-100 mb-10">
            <div className="main-container">
                <h1 className="text-[48px] md:text-[46px] font-bold text-center text-[#214A9E] leading-tight">What Is GHK-Cu?</h1>
            </div>
        </section>
        <div className="main-container pb-16">
            <div className="bg-[#F0F5FB] border-l-[3px] border-[#1a4494] p-5 mb-10 rounded-[4px]">
                <p className="text-[13.5px] text-slate-700 leading-relaxed">
                    <strong className="text-[#150F3A]">Research Use Only:</strong> All peptides discussed on this page are for in-vitro laboratory research only. Not for human consumption, medical treatment, or veterinary use.{' '}
                    <Link to="/pages/research-use-disclaimer" className="text-[#3390ec] hover:underline">Read our full disclaimer.</Link>
                </p>
            </div>
            <div className="mb-10">
                <h2 className="text-[18px] font-bold text-[#150F3A] mb-4 border-b border-slate-200 pb-2">Overview</h2>
                <div className="space-y-4 text-[14px] text-slate-700 leading-[1.8]">
                    <p>GHK-Cu is one of the most studied copper peptides in dermal and skin biology research. It is a naturally occurring compound found in human plasma, saliva, and urine that has attracted significant scientific interest for its role in skin matrix remodelling, collagen synthesis, and cellular repair signalling.</p>
                    <p>GHK-Cu consists of the tripeptide glycyl-L-histidyl-L-lysine (Gly-His-Lys) bound to a copper ion (Cu²⁺). The peptide sequence has a high affinity for copper, forming a stable complex that researchers study for its potential biological activities in controlled experimental models.</p>
                    <p>Unlike metabolic peptides such as Retatrutide or repair peptides like BPC-157 and TB-500, GHK-Cu represents a distinct category of peptide research focused on copper-mediated signalling and dermal applications rather than metabolic or migration-based mechanisms.</p>
                </div>
            </div>
            <div className="mb-10">
                <h2 className="text-[18px] font-bold text-[#150F3A] mb-4 border-b border-slate-200 pb-2">Research Applications</h2>
                <div className="space-y-3">
                    {researchApps.map((item) => (
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
                    <li>Copper-peptide complex (Gly-His-Lys + Cu²⁺)</li>
                    <li>Naturally occurring sequence found in human plasma</li>
                    <li>Focused on dermal biology and extracellular matrix research</li>
                    <li>Distinct from metabolic and tissue-repair peptide categories</li>
                    <li>Research-grade purity ≥99%</li>
                </ul>
            </div>
            <div className="mb-10">
                <h2 className="text-[18px] font-bold text-[#150F3A] mb-4 border-b border-slate-200 pb-2">Related Compounds</h2>
                <div className="flex flex-wrap gap-3">
                    {[
                        { label: 'GHK-Cu 50mg', to: '/products/ghk-cu-50mg' },
                        { label: 'BPC-157', to: '/pages/what-is-bpc-157' },
                        { label: 'Compound Index', to: '/pages/research-compound-database' },
                        { label: 'COA & Lab Testing', to: '/pages/coa-lab-testing' },
                    ].map((link) => (
                        <Link key={link.to} to={link.to} className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] text-[#3390ec] hover:bg-slate-50 transition-colors">{link.label}</Link>
                    ))}
                </div>
            </div>
            <div className="bg-[#F0F5FB] border-l-[3px] border-[#1a4494] p-5 rounded-[4px] mb-8">
                <p className="text-[13.5px] text-slate-700 leading-relaxed">
                    <strong className="text-[#150F3A]">Research Use Only:</strong> All products are manufactured for in-vitro laboratory research and are not intended for human consumption, medical use, or veterinary applications.
                </p>
            </div>
        </div>
    </div>
);

export default WhatIsGHKCu;
