import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const WhatIsMOTSc = () => (
    <div className="min-h-screen bg-white font-sans">
        <Helmet>
            <title>What Is MOTS-c? | Mitochondrial Peptide Research | Solatide Biosciences</title>
            <meta name="description" content="MOTS-c is a mitochondria-derived peptide studied for metabolic regulation, cellular energy, and AMPK pathway activation. For in-vitro research use only." />
            <link rel="canonical" href="https://solatidebiosciences.com.au/pages/what-is-mots-c" />
        </Helmet>
        <section className="w-full py-4 text-center border-b border-slate-100 mb-10">
            <div className="main-container">
                <h1 className="text-[48px] md:text-[46px] font-bold text-center text-[#214A9E] leading-tight">What Is MOTS-c?</h1>
            </div>
        </section>
        <div className="main-container pb-16">
            <div className="bg-[#F0F5FB] border-l-[3px] border-[#1a4494] p-5 mb-10 rounded-[4px]">
                <p className="text-[13.5px] text-slate-700 leading-relaxed">
                    <strong className="text-[#150F3A]">Research Use Only:</strong> All peptides discussed are for in-vitro laboratory research only. Not for human consumption, medical treatment, or veterinary use.{' '}
                    <Link to="/pages/research-use-disclaimer" className="text-[#3390ec] hover:underline">Read our full disclaimer.</Link>
                </p>
            </div>
            <div className="mb-10">
                <h2 className="text-[18px] font-bold text-[#150F3A] mb-4 border-b border-slate-200 pb-2">Overview</h2>
                <div className="space-y-4 text-[14px] text-slate-700 leading-[1.8]">
                    <p>MOTS-c (Mitochondrial Open Reading Frame of the 12S rRNA-c) is a mitochondria-derived peptide encoded within the 12S ribosomal RNA gene of the mitochondrial genome. Its discovery opened a new area of research into mitochondria-to-nucleus signalling and metabolic regulation.</p>
                    <p>Unlike conventional peptides encoded in the nuclear genome, MOTS-c is translated from a mitochondrial DNA reading frame, making it part of a growing class of small proteins called mitochondria-derived peptides (MDPs). Researchers study it alongside compounds such as SS-31 and humanin in the context of mitochondrial biology research.</p>
                    <p>MOTS-c contains 16 amino acids and has been studied for its interactions with AMPK-related pathways, insulin sensitivity models, and metabolic signalling. Its classification as a metabolic regulator represents an intersection between mitochondrial research and metabolic pathway investigation.</p>
                </div>
            </div>
            <div className="mb-10">
                <h2 className="text-[18px] font-bold text-[#150F3A] mb-4 border-b border-slate-200 pb-2">Research Applications</h2>
                <div className="space-y-3">
                    {[
                        { title: 'AMPK pathway activation', desc: 'Research examines how MOTS-c interacts with the AMPK (AMP-activated protein kinase) signalling pathway, a central regulator of cellular energy homeostasis.' },
                        { title: 'Mitochondrial signalling', desc: 'Studies investigate MOTS-c as a retrograde signalling molecule from mitochondria to the nucleus, influencing gene expression related to metabolism.' },
                        { title: 'Glucose metabolism', desc: 'Laboratory models examine the effects of MOTS-c on glucose uptake, oxidative metabolism, and insulin-related signalling in muscle cell models.' },
                        { title: 'Exercise physiology models', desc: 'MOTS-c has been studied in contexts related to exercise response pathways, energy expenditure, and metabolic adaptation in controlled research settings.' },
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
                    <li>16-amino acid mitochondria-derived peptide (MDP)</li>
                    <li>Encoded by mitochondrial DNA (12S rRNA gene)</li>
                    <li>Studies AMPK and metabolic signalling pathways</li>
                    <li>Part of the mitochondria-derived peptide (MDP) class alongside SS-31 and humanin</li>
                    <li>Research-grade purity ≥99%</li>
                </ul>
            </div>
            <div className="mb-10">
                <h2 className="text-[18px] font-bold text-[#150F3A] mb-4 border-b border-slate-200 pb-2">Related Compounds and Comparisons</h2>
                <div className="flex flex-wrap gap-3">
                    {[
                        { label: 'MOTS-c 10mg', to: '/products/mots-c-10mg' },
                        { label: 'SS-31 Elamipretide', to: '/products/ss-31-elamipretide-10mg-lyophilised-peptide' },
                        { label: 'MOTS-c vs SS-31', to: '/pages/mots-c-vs-ss-31' },
                        { label: 'NAD+ vs MOTS-c', to: '/pages/nad-plus-vs-mots-c' },
                        { label: 'Compound Index', to: '/pages/research-compound-database' },
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

export default WhatIsMOTSc;
