import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const researchApps = [
    {
        title: 'Visceral Adipose Tissue and Lipid Metabolism',
        desc: "Studies explore Tesamorelin's impact on visceral fat reduction, hepatic triglyceride accumulation, and overall lipid profiles in experimental metabolic disease models."
    },
    {
        title: 'Growth Hormone-Releasing Hormone Signalling',
        desc: 'Researchers examine the molecular mechanisms governing GHRH receptor sensitivity, somatotroph feedback inhibition, and pituitary hormonal dynamics in vitro.'
    },
    {
        title: 'Neurocognitive and Brain Function Studies',
        desc: "Laboratory research investigates the potential neuroprotective effects of GHRH analogues, including Tesamorelin's influence on cognitive function markers, neurogenesis, and cerebral blood flow."
    },
    {
        title: 'Body Composition and Lean Tissue Preservation',
        desc: 'In experimental models, Tesamorelin is evaluated for its capacity to preserve or increase lean body mass and modulate nitrogen balance without disrupting glucose homeostasis.'
    },
    {
        title: 'Cardiovascular and Endothelial Marker Research',
        desc: 'Scientific studies investigate the downstream cardiovascular effects of optimized GH/IGF-1 axis function, including markers of endothelial health and arterial stiffness.'
    }
];

const WhatIsTesamorelin = () => {
    return (
        <div className="min-h-screen bg-white font-sans">
            <Helmet>
                <title>What Is Tesamorelin? | GHRH Peptide Research | Solatide Biosciences</title>
                <meta
                    name="description"
                    content="Tesamorelin is a synthetic 44-amino acid analogue of growth hormone-releasing hormone (GHRH) studied for pituitary signalling, visceral adiposity, and IGF-1 modulation. For in-vitro research use only."
                />
                <link rel="canonical" href="https://solatidebiosciences.com.au/pages/what-is-tesamorelin" />
            </Helmet>

            <section className="w-full py-4 text-center border-b border-slate-100 mb-10">
                <div className="main-container">
                    <h1 className="text-[48px] md:text-[46px] font-bold text-center text-[#214A9E] leading-tight">
                        What Is Tesamorelin?
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
                            Tesamorelin is a synthetic peptide analogue of growth hormone-releasing hormone (GHRH) consisting of a 44-amino acid sequence modified with a trans-3-hexenoic acid group at its N-terminus. This structural modification enhances its stability and resistance to enzymatic degradation compared to native GHRH, making it a valuable tool in laboratory research.
                        </p>
                        <p>
                            In research environments, Tesamorelin is primarily investigated for its effects on the hypothalamic-pituitary-somatotropic axis, specifically its ability to stimulate the synthesis and pulsatile release of endogenous growth hormone (GH) and subsequent downstream production of insulin-like growth factor 1 (IGF-1).
                        </p>
                        <p>
                            Unlike exogenous growth hormone administration, Tesamorelin acts upstream at the level of the pituitary gland, preserving endogenous feedback regulation mechanisms. This characteristic makes it a subject of extensive investigation in metabolic research, visceral adiposity studies, and neurocognitive models.
                        </p>
                    </div>
                </div>

                <div className="mb-10">
                    <h2 className="text-[18px] font-bold text-[#150F3A] mb-4 border-b border-slate-200 pb-2">Mechanism and Research Context</h2>
                    <div className="space-y-4 text-[14px] text-slate-700 leading-[1.8]">
                        <p>
                            Tesamorelin functions by binding to specific growth hormone-releasing hormone receptors (GHRH-R) located on somatotroph cells in the anterior pituitary gland. Upon receptor binding, it activates intracellular adenylate cyclase pathways, leading to an increase in cyclic adenosine monophosphate (cAMP) and protein kinase A (PKA) activation. This signalling cascade promotes the synthesis and secretion of growth hormone in a manner that mimics physiological pulsatile release.
                        </p>
                        <p>
                            Researchers investigate Tesamorelin's downstream effects, which are largely mediated through IGF-1 signalling pathways. Elevated IGF-1 levels influence various cellular and physiological processes, including lipid metabolism, protein synthesis, glucose homeostasis, and tissue regeneration in experimental models.
                        </p>
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
                        <li>Synthetic 44-amino acid analogue of growth hormone-releasing hormone (GHRH)</li>
                        <li>Modified with trans-3-hexenoic acid at N-terminus for enhanced enzymatic stability</li>
                        <li>Selectively stimulates endogenous pulsatile growth hormone secretion</li>
                        <li>Preserves pituitary-somatotropic negative feedback mechanisms</li>
                        <li>Investigated for visceral fat reduction, IGF-1 elevation, and neurocognitive pathways</li>
                        <li>High research-grade purity (≥99%)</li>
                    </ul>
                </div>

                <div className="mb-10">
                    <h2 className="text-[18px] font-bold text-[#150F3A] mb-4 border-b border-slate-200 pb-2">Related Compounds and Comparisons</h2>
                    <div className="flex flex-wrap gap-3">
                        {[
                            { label: 'CJC-1295 vs Tesamorelin', to: '/pages/cjc-1295-vs-tesamorelin' },
                            { label: 'Tesamorelin vs Ipamorelin', to: '/pages/tesamorelin-vs-ipamorelin' },
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
                        All Tesamorelin reference materials and research products from Solatide Biosciences are independently third-party tested for purity, identity, and sequence verification. Batch-specific Certificates of Analysis (COAs) generated via HPLC and MS are available for each product.{' '}
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

export default WhatIsTesamorelin;
