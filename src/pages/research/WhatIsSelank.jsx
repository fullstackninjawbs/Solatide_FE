import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const WhatIsSelank = () => (
    <div className="min-h-screen bg-white font-sans">
        <Helmet>
            <title>What Is Selank? | Neuropeptide Research | Solatide Biosciences</title>
            <meta name="description" content="Selank is a heptapeptide studied for anxiolytic-like effects, BDNF expression, and immune modulation in laboratory research models. For in-vitro research use only." />
            <link rel="canonical" href="https://solatidebiosciences.com.au/pages/what-is-selank" />
        </Helmet>
        <section className="w-full py-4 text-center border-b border-slate-100 mb-10">
            <div className="main-container">
                <h1 className="text-[48px] md:text-[46px] font-bold text-center text-[#214A9E] leading-tight">What Is Selank?</h1>
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
                    <p>Selank is a synthetic heptapeptide and tuftsin analogue developed in Russia at the Institute of Molecular Genetics. It has attracted scientific interest in both neuropeptide research and immunology laboratory settings. Selank is often studied alongside Semax, another nootropic neuropeptide, in comparative research frameworks.</p>
                    <p>The peptide sequence of Selank (Thr-Lys-Pro-Arg-Pro-Gly-Pro) is derived from the naturally occurring immunomodulatory peptide tuftsin, extended with additional amino acids to improve stability. This structural modification is the subject of laboratory investigations into how minor sequence changes affect peptide stability, binding, and receptor interactions.</p>
                    <p>Selank is primarily studied in the context of neuropeptide biology, examining its potential effects on GABA-A receptor systems, monoamine regulation, and neurotrophic factor expression in controlled in-vitro and animal model settings.</p>
                </div>
            </div>
            <div className="mb-10">
                <h2 className="text-[18px] font-bold text-[#150F3A] mb-4 border-b border-slate-200 pb-2">Research Applications</h2>
                <div className="space-y-3">
                    {[
                        { title: 'GABA receptor modulation', desc: 'Selank research examines its potential effects on GABA-A receptor activity and the GABA-ergic system, particularly in anxiety-related and inhibitory signalling pathway models.' },
                        { title: 'BDNF expression', desc: 'Laboratory studies investigate whether Selank influences BDNF (Brain-Derived Neurotrophic Factor) expression and its downstream signalling, a pathway studied in neuroplasticity research.' },
                        { title: 'Monoamine modulation', desc: 'Research examines Selank interactions with dopamine, serotonin, and noradrenaline signalling systems in experimental neuropharmacology contexts.' },
                        { title: 'Immune modulation', desc: 'As a tuftsin analogue, Selank has been studied in immunology research, examining effects on cytokine profiles, immune cell activity, and immunoglobulin levels in laboratory models.' },
                        { title: 'Peptide stability research', desc: 'Laboratory investigations study how Selank resists enzymatic degradation, comparing it with tuftsin and examining structure-stability relationships in peptide research.' },
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
                    <li>Synthetic heptapeptide (7 amino acids)</li>
                    <li>Tuftsin analogue with enhanced stability</li>
                    <li>Studied in neuropeptide and immunology research contexts</li>
                    <li>Closely related to Semax in research applications</li>
                    <li>Research-grade purity ≥99%</li>
                </ul>
            </div>
            <div className="mb-10">
                <h2 className="text-[18px] font-bold text-[#150F3A] mb-4 border-b border-slate-200 pb-2">Related Compounds and Comparisons</h2>
                <div className="flex flex-wrap gap-3">
                    {[
                        { label: 'Selank & Semax Blend 20mg', to: '/products/selank-semax-20mg' },
                        { label: 'Selank vs Semax', to: '/pages/selank-vs-semax' },
                        { label: 'What Is Semax?', to: '/pages/what-is-semax' },
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

export default WhatIsSelank;
