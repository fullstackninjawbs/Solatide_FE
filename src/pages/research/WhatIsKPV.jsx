import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const researchApps = [
    {
        title: 'Inflammatory Bowel and Mucosal Research',
        desc: 'Evaluated in intestinal inflammation models to examine its potential in modulating gut barrier permeability, tight junction protein integrity, and mucosal cytokine expression.'
    },
    {
        title: 'Dermatological and Wound Healing Models',
        desc: 'Investigated in skin biology research for its anti-inflammatory effects on keratinocytes and its ability to reduce experimental erythema and accelerate re-epithelialization in vitro.'
    },
    {
        title: 'Antimicrobial and Antifungal Investigations',
        desc: 'Studied for direct inhibitory actions against bacteria (such as Staphylococcus aureus) and fungi (such as Candida albicans) in laboratory settings without inducing typical antimicrobial resistance.'
    },
    {
        title: 'Ocular and Systemic Inflammation Pathways',
        desc: 'Explored in models of uveitis and systemic inflammatory cascades to understand how small-molecule peptides influence localized immune responses and leukocyte extravasation.'
    }
];

const WhatIsKPV = () => {
    return (
        <div className="min-h-screen bg-white font-sans">
            <Helmet>
                <title>What Is KPV? | Anti-Inflammatory Peptide Research | Solatide Biosciences</title>
                <meta
                    name="description"
                    content="KPV is a synthetic tripeptide (Lys-Pro-Val) derived from alpha-MSH studied for anti-inflammatory signalling, NF-κB inhibition, and mucosal barrier models. For in-vitro research use only."
                />
                <link rel="canonical" href="https://solatidebiosciences.com.au/pages/what-is-kpv" />
            </Helmet>

            <section className="w-full py-4 text-center border-b border-slate-100 mb-10">
                <div className="main-container">
                    <h1 className="text-[48px] md:text-[46px] font-bold text-center text-[#214A9E] leading-tight">
                        What Is KPV?
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
                        <p>
                            KPV is a synthetic tripeptide consisting of the amino acid sequence Lysine-Proline-Valine (Lys-Pro-Val). It is a structurally active C-terminal fragment of alpha-melanocyte-stimulating hormone (alpha-MSH), a naturally occurring neuropeptide involved in neuroimmune regulation and anti-inflammatory signalling.
                        </p>
                        <p>
                            Despite lacking the melanotropic (pigment-stimulating) properties of full-length alpha-MSH, KPV retains potent anti-inflammatory and immunomodulatory activity. Because of its small molecular weight (approximately 383.5 Da), KPV exhibits high bio-membrane permeability and structural stability, making it an attractive candidate in laboratory research focusing on inflammatory pathways, mucosal integrity, and microbial response mechanisms.
                        </p>
                        <p>
                            Within the peptide research sphere, KPV is frequently studied alongside gut-protective and regenerative sequences like BPC-157 to contrast single-cascade cytokine suppression against multi-pathway angiogenic repair.
                        </p>
                    </div>
                </div>

                <div className="mb-10">
                    <h2 className="text-[18px] font-bold text-[#150F3A] mb-4 border-b border-slate-200 pb-2">Mechanism and Research Context</h2>
                    <div className="space-y-4 text-[14px] text-slate-700 leading-[1.8]">
                        <p>
                            KPV exerts its biological effects primarily through the inhibition of pro-inflammatory signalling cascades. Experimental studies have shown that KPV enters cells via peptide transporter 1 (PepT1) and directly modulates intracellular pathways.
                        </p>
                        <p>
                            Key molecular mechanisms investigated in laboratory models include:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-[14px] text-slate-700">
                            <li>
                                <strong>NF-κB Pathway Inhibition:</strong> KPV inhibits the nuclear translocation of Nuclear Factor kappa B (NF-κB), thereby attenuating the transcription of pro-inflammatory cytokines such as TNF-α, IL-1β, and IL-6.
                            </li>
                            <li>
                                <strong>MAPK Signalling Modulation:</strong> Research indicates that KPV may modulate mitogen-activated protein kinase (MAPK) cascades, suppressing inflammatory responses in epithelial and immune cell cultures.
                            </li>
                            <li>
                                <strong>Antimicrobial Activity:</strong> Studies demonstrate direct antimicrobial properties against common pathogens, including <em>Staphylococcus aureus</em> and <em>Candida albicans</em>, likely mediated through membrane disruption mechanisms.
                            </li>
                            <li>
                                <strong>Mucosal and Wound Healing Signalling:</strong> In epithelial tissue models, KPV has been investigated for its capacity to accelerate wound re-epithelialization and support mucosal barrier integrity.
                            </li>
                        </ul>
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
                        <li>Naturally derived C-terminal tripeptide fragment of alpha-MSH (Lys-Pro-Val)</li>
                        <li>Small molecular weight (~383.5 Da) facilitating cellular uptake via PepT1</li>
                        <li>Non-pigmenting: lacks the melanocortin receptor-mediated melanotropic actions of alpha-MSH</li>
                        <li>Potent inhibitor of NF-κB nuclear translocation and inflammatory cytokine synthesis</li>
                        <li>Investigated in mucosal barrier, dermatological, and antimicrobial models</li>
                        <li>Research-grade purity ≥99%</li>
                    </ul>
                </div>

                <div className="mb-10">
                    <h2 className="text-[18px] font-bold text-[#150F3A] mb-4 border-b border-slate-200 pb-2">Related Compounds and Comparisons</h2>
                    <div className="flex flex-wrap gap-3">
                        {[
                            { label: 'BPC-157 vs KPV', to: '/pages/bpc-157-vs-kpv' },
                            { label: 'BPC-157 10mg', to: '/products/bpc-157-10mg' },
                            { label: 'Compound Database', to: '/pages/research-compound-database' },
                            { label: 'Peptides Guide', to: '/pages/research-peptides-guide' },
                        ].map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] text-[#3390ec] hover:bg-slate-50 transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="mb-10">
                    <h2 className="text-[18px] font-bold text-[#150F3A] mb-4 border-b border-slate-200 pb-2">Quality and Documentation</h2>
                    <p className="text-[14px] text-slate-700 leading-[1.8]">
                        All KPV research peptides provided by Solatide Biosciences are manufactured according to strict quality standards and verified by independent third-party analytical laboratories. Every batch is supported by HPLC and Mass Spectrometry Certificates of Analysis.{' '}
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

export default WhatIsKPV;
