import React from 'react';
import { Link } from 'react-router-dom';

const CompoundDatabase = () => {
    return (
        <div className="min-h-screen bg-white font-sans">
            <section className="w-full py-8 text-center border-b border-slate-100 mb-10">
                <div className="main-container">
                    <h1 className="text-[48px] md:text-[46px] font-bold text-center text-[#214A9E] leading-tight">
                        Compound Index
                    </h1>
                </div>
            </section>
            
            <div className="main-container pb-16">
                <div className="bg-[#F0F5FB] border-l-[3px] border-[#1a4494] p-5 mb-14 rounded-[4px]">
                    <p className="text-[13.5px] text-slate-700 leading-relaxed">
                        <strong className="text-[#150F3A]">Research Use Only:</strong> All compounds listed in this index are intended strictly for in-vitro laboratory research purposes only. Not for human consumption, medical treatment, or veterinary use. <Link to="/research-use" className="text-[#3390ec] hover:underline">Read our full disclaimer.</Link>
                    </p>
                </div>

                <div className="mb-14">
                    <h2 className="text-[20px] font-bold text-[#214A9E] mb-4">Compound Index</h2>
                    <p className="text-[14px] text-slate-700 mb-6 leading-[1.8]">
                        Browse Solatide's research compound index by compound name, category and research pathway. Each entry links to relevant product pages, batch documentation and available research-use information. New to research peptides? <Link to="/peptides-guide" className="text-[#3390ec] hover:underline">Read the Peptide Guide first.</Link>
                    </p>
                    <div className="flex flex-wrap gap-4 mb-14">
                        <Link to="/shop" className="bg-[#214A9E] text-white px-7 py-2.5 rounded-full text-[13px] font-semibold hover:bg-[#163678] transition-colors shadow-sm">Browse All Products</Link>
                        <Link to="/research-resource" className="border border-[#214A9E] text-[#214A9E] px-7 py-2.5 rounded-full text-[13px] font-semibold hover:bg-[#F0F5FB] transition-colors">All Research Resources</Link>
                    </div>
                </div>

                {/* GLP-1 & Metabolic Pathway */}
                <div className="mb-14">
                    <h2 className="text-[18px] font-bold text-[#150F3A] mb-5 border-b border-slate-200 pb-3">GLP-1 & Metabolic Pathway</h2>
                    <div className="space-y-4">
                        <div className="bg-[#f8fafc] border-l-[3px] border-[#3390ec] p-6 rounded-[4px]">
                            <span className="inline-block bg-[#e6effc] text-[#214A9E] text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider mb-2">GLP-1 AGONIST</span>
                            <h3 className="text-[14.5px] font-bold text-[#150F3A] mb-2">Semaglutide</h3>
                            <p className="text-[13.5px] text-slate-700 leading-relaxed mb-4">A long-acting GLP-1 receptor agonist used in metabolic research. Structural modifications enable extended half-life and sustained receptor activation in experimental models.</p>
                            <Link to="/research-insight/semaglutide" className="border border-[#214A9E] text-[#214A9E] px-5 py-1.5 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors inline-block bg-white">Research Overview</Link>
                        </div>
                        
                        <div className="bg-[#f8fafc] border-l-[3px] border-[#3390ec] p-6 rounded-[4px]">
                            <span className="inline-block bg-[#e6effc] text-[#214A9E] text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider mb-2">DUAL GLP-1/GIP AGONIST</span>
                            <h3 className="text-[14.5px] font-bold text-[#150F3A] mb-2">Tirzepatide</h3>
                            <p className="text-[13.5px] text-slate-700 leading-relaxed mb-4">A dual GLP-1/GIP receptor agonist used to investigate coordinated incretin receptor activation and integrated metabolic responses in laboratory models.</p>
                            <Link to="/research-insight/tirzepatide" className="border border-[#214A9E] text-[#214A9E] px-5 py-1.5 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors inline-block bg-white">Research Overview</Link>
                        </div>

                        <div className="bg-[#f8fafc] border-l-[3px] border-[#3390ec] p-6 rounded-[4px]">
                            <span className="inline-block bg-[#e6effc] text-[#214A9E] text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider mb-2">TRIPLE GLP-1/GIP/GLUCAGON AGONIST</span>
                            <h3 className="text-[14.5px] font-bold text-[#150F3A] mb-2">Retatrutide</h3>
                            <p className="text-[13.5px] text-slate-700 leading-relaxed mb-4">A triple agonist peptide demonstrating balanced activity at GLP-1, GIP and glucagon receptors. Independently third-party tested to &gt;99% purity.</p>
                            <div className="flex gap-3">
                                <Link to="/research-insight/retatrutide" className="border border-[#214A9E] text-[#214A9E] px-5 py-1.5 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors inline-block bg-white">Research Overview</Link>
                                <Link to="/research-insight/what-is-retatrutide" className="border border-[#214A9E] text-[#214A9E] px-5 py-1.5 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors inline-block bg-white">What is Retatrutide?</Link>
                                <Link to="/research-insight/retatrutide-vs-semaglutide" className="border border-[#214A9E] text-[#214A9E] px-5 py-1.5 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors inline-block bg-white">vs Semaglutide</Link>
                            </div>
                        </div>

                        <div className="bg-[#f8fafc] border-l-[3px] border-[#3390ec] p-6 rounded-[4px]">
                            <span className="inline-block bg-[#e6effc] text-[#214A9E] text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider mb-2">GLP-1 + AMYLIN COMBINATION</span>
                            <h3 className="text-[14.5px] font-bold text-[#150F3A] mb-2">CagriSema</h3>
                            <p className="text-[13.5px] text-slate-700 leading-relaxed mb-4">A pre-blended lyophilised research material combining Cagrilintide and Semaglutide in a 1:1 ratio (5mg:5mg per 10mg vial). Independently third-party tested to &gt;99% purity.</p>
                            <div className="flex gap-3">
                                <Link to="/research-insight/cagrisema" className="border border-[#214A9E] text-[#214A9E] px-5 py-1.5 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors inline-block bg-white">Research Overview</Link>
                                <Link to="/research-insight/cagrisema-comparison" className="border border-[#214A9E] text-[#214A9E] px-5 py-1.5 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors inline-block bg-white">Comparison Guide</Link>
                            </div>
                        </div>

                        <div className="bg-[#f8fafc] border-l-[3px] border-[#3390ec] p-6 rounded-[4px]">
                            <span className="inline-block bg-[#e6effc] text-[#214A9E] text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider mb-2">AMYLIN RECEPTOR AGONIST</span>
                            <h3 className="text-[14.5px] font-bold text-[#150F3A] mb-2">Cagrilintide</h3>
                            <p className="text-[13.5px] text-slate-700 leading-relaxed mb-4">An amylin receptor agonist studied as an emerging metabolic research compound. Used alongside GLP-1 agonists to investigate dual-pathway receptor activation.</p>
                            <Link to="/research-insight/cagrilintide" className="border border-[#214A9E] text-[#214A9E] px-5 py-1.5 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors inline-block bg-white">Research Overview</Link>
                        </div>

                        <div className="bg-[#f8fafc] border-l-[3px] border-[#3390ec] p-6 rounded-[4px]">
                            <span className="inline-block bg-[#e6effc] text-[#214A9E] text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider mb-2">NNMT INHIBITOR — SMALL MOLECULE</span>
                            <h3 className="text-[14.5px] font-bold text-[#150F3A] mb-2">5-Amino-1MQ</h3>
                            <p className="text-[13.5px] text-slate-700 leading-relaxed mb-4">A selective inhibitor of NNMT studied in preclinical laboratory models. Relevant to cellular energy expenditure, methyl-group flux and downstream metabolic signalling. Independently third-party tested to &gt;99% purity.</p>
                            <div className="flex gap-3">
                                <Link to="/product/5-amino-1mq" className="border border-[#214A9E] text-[#214A9E] px-5 py-1.5 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors inline-block bg-white">View Product</Link>
                                <Link to="/research-insight/nnmt-article" className="border border-[#214A9E] text-[#214A9E] px-5 py-1.5 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors inline-block bg-white">NNMT Research Article</Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Growth Hormone Axis */}
                <div className="mb-14">
                    <h2 className="text-[18px] font-bold text-[#150F3A] mb-5 border-b border-slate-200 pb-3">Growth Hormone Axis</h2>
                    <div className="space-y-4">
                        <div className="bg-[#f8fafc] border-l-[3px] border-[#3390ec] p-6 rounded-[4px]">
                            <span className="inline-block bg-[#e6effc] text-[#214A9E] text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider mb-2">GHRH ANALOGUE</span>
                            <h3 className="text-[14.5px] font-bold text-[#150F3A] mb-2">Tesamorelin</h3>
                            <p className="text-[13.5px] text-slate-700 leading-relaxed mb-4">A stabilised GHRH analogue studied for growth hormone secretion, hypothalamic-pituitary signalling and visceral adipose tissue research in laboratory models. Independently third-party tested to &gt;99% purity.</p>
                            <div className="flex gap-3">
                                <Link to="/research-insight/tesamorelin" className="border border-[#214A9E] text-[#214A9E] px-5 py-1.5 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors inline-block bg-white">What is Tesamorelin?</Link>
                                <Link to="/product/tesamorelin" className="border border-[#214A9E] text-[#214A9E] px-5 py-1.5 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors inline-block bg-white">View Product</Link>
                            </div>
                        </div>

                        <div className="bg-[#f8fafc] border-l-[3px] border-[#3390ec] p-6 rounded-[4px]">
                            <span className="inline-block bg-[#e6effc] text-[#214A9E] text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider mb-2">GHRH ANALOGUE</span>
                            <h3 className="text-[14.5px] font-bold text-[#150F3A] mb-2">CJC-1295 No DAC</h3>
                            <p className="text-[13.5px] text-slate-700 leading-relaxed mb-4">A 29-amino-acid GHRH analogue with stabilising substitutions. Used to study GH pulse dynamics and pituitary somatotroph signalling. Frequently combined with Ipamorelin in laboratory research. Independently third-party tested to &gt;99% purity.</p>
                            <div className="flex gap-3">
                                <Link to="/research-insight/cjc-1295" className="border border-[#214A9E] text-[#214A9E] px-5 py-1.5 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors inline-block bg-white">What is CJC-1295?</Link>
                                <Link to="/product/cjc-1295" className="border border-[#214A9E] text-[#214A9E] px-5 py-1.5 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors inline-block bg-white">View Product</Link>
                            </div>
                        </div>

                        <div className="bg-[#f8fafc] border-l-[3px] border-[#3390ec] p-6 rounded-[4px]">
                            <span className="inline-block bg-[#e6effc] text-[#214A9E] text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider mb-2">GHS-R AGONIST</span>
                            <h3 className="text-[14.5px] font-bold text-[#150F3A] mb-2">Ipamorelin</h3>
                            <p className="text-[13.5px] text-slate-700 leading-relaxed mb-4">A selective ghrelin receptor (GHS-R1a) agonist pentapeptide. Studied for GH secretagogue signalling with high receptor selectivity and minimal effect on cortisol or prolactin in laboratory models. Independently third-party tested to &gt;99% purity.</p>
                            <div className="flex gap-3">
                                <Link to="/research-insight/ipamorelin" className="border border-[#214A9E] text-[#214A9E] px-5 py-1.5 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors inline-block bg-white">What is Ipamorelin?</Link>
                                <Link to="/product/ipamorelin" className="border border-[#214A9E] text-[#214A9E] px-5 py-1.5 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors inline-block bg-white">View Product</Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mitochondrial & Cellular Energy Research */}
                <div className="mb-14">
                    <h2 className="text-[18px] font-bold text-[#150F3A] mb-5 border-b border-slate-200 pb-3">Mitochondrial & Cellular Energy Research</h2>
                    <div className="space-y-4">
                        <div className="bg-[#f8fafc] border-l-[3px] border-[#3390ec] p-6 rounded-[4px]">
                            <span className="inline-block bg-[#e6effc] text-[#214A9E] text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider mb-2">MITOCHONDRIAL-DERIVED PEPTIDE</span>
                            <h3 className="text-[14.5px] font-bold text-[#150F3A] mb-2">MOTS-c</h3>
                            <p className="text-[13.5px] text-slate-700 leading-relaxed mb-4">A mitochondrial-derived peptide studied for AMPK activation, metabolic regulation, insulin sensitivity and cellular stress response in laboratory models. Independently third-party tested to &gt;99% purity.</p>
                            <div className="flex gap-3">
                                <Link to="/research-insight/mots-c" className="border border-[#214A9E] text-[#214A9E] px-5 py-1.5 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors inline-block bg-white">What is MOTS-c?</Link>
                                <Link to="/product/mots-c" className="border border-[#214A9E] text-[#214A9E] px-5 py-1.5 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors inline-block bg-white">View Product</Link>
                            </div>
                        </div>

                        <div className="bg-[#f8fafc] border-l-[3px] border-[#3390ec] p-6 rounded-[4px]">
                            <span className="inline-block bg-[#e6effc] text-[#214A9E] text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider mb-2">MITOCHONDRIA-TARGETED PEPTIDE</span>
                            <h3 className="text-[14.5px] font-bold text-[#150F3A] mb-2">SS-31 (Elamipretide)</h3>
                            <p className="text-[13.5px] text-slate-700 leading-relaxed mb-4">A tetrapeptide that selectively accumulates in the inner mitochondrial membrane. Studied for cardiolipin binding, ETC stabilisation and cellular energy production in laboratory models. Independently third-party tested to &gt;99% purity.</p>
                            <div className="flex gap-3">
                                <Link to="/research-insight/ss-31" className="border border-[#214A9E] text-[#214A9E] px-5 py-1.5 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors inline-block bg-white">What is SS-31?</Link>
                                <Link to="/product/ss-31" className="border border-[#214A9E] text-[#214A9E] px-5 py-1.5 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors inline-block bg-white">View Product</Link>
                            </div>
                        </div>

                        <div className="bg-[#f8fafc] border-l-[3px] border-[#3390ec] p-6 rounded-[4px]">
                            <span className="inline-block bg-[#e6effc] text-[#214A9E] text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider mb-2">COENZYME — METABOLIC RESEARCH</span>
                            <h3 className="text-[14.5px] font-bold text-[#150F3A] mb-2">NAD+</h3>
                            <p className="text-[13.5px] text-slate-700 leading-relaxed mb-4">A central coenzyme studied for cellular energy metabolism, sirtuin activation, DNA repair and mitochondrial function in laboratory models. Independently third-party tested to &gt;99% purity.</p>
                            <div className="flex gap-3">
                                <Link to="/research-insight/nad" className="border border-[#214A9E] text-[#214A9E] px-5 py-1.5 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors inline-block bg-white">What is NAD+?</Link>
                                <Link to="/product/nad" className="border border-[#214A9E] text-[#214A9E] px-5 py-1.5 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors inline-block bg-white">View Product</Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tissue & Cellular Research */}
                <div className="mb-14">
                    <h2 className="text-[18px] font-bold text-[#150F3A] mb-5 border-b border-slate-200 pb-3">Tissue & Cellular Research</h2>
                    <div className="space-y-4">
                        <div className="bg-[#f8fafc] border-l-[3px] border-[#3390ec] p-6 rounded-[4px]">
                            <span className="inline-block bg-[#e6effc] text-[#214A9E] text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider mb-2">REPAIR PEPTIDE</span>
                            <h3 className="text-[14.5px] font-bold text-[#150F3A] mb-2">BPC-157</h3>
                            <p className="text-[13.5px] text-slate-700 leading-relaxed mb-4">Body protection compound studied for cellular repair mechanisms and tissue response pathways. One of the most widely referenced repair peptides in in-vitro research. Independently third-party tested to &gt;99% purity.</p>
                            <div className="flex gap-3">
                                <Link to="/research-insight/bpc-157" className="border border-[#214A9E] text-[#214A9E] px-5 py-1.5 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors inline-block bg-white">What is BPC-157?</Link>
                                <Link to="/research-insight/bpc-157-vs-tb-500" className="border border-[#214A9E] text-[#214A9E] px-5 py-1.5 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors inline-block bg-white">BPC-157 vs TB-500</Link>
                            </div>
                        </div>

                        <div className="bg-[#f8fafc] border-l-[3px] border-[#3390ec] p-6 rounded-[4px]">
                            <span className="inline-block bg-[#e6effc] text-[#214A9E] text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider mb-2">REPAIR PEPTIDE</span>
                            <h3 className="text-[14.5px] font-bold text-[#150F3A] mb-2">TB-500 (Thymosin Beta-4 Fragment)</h3>
                            <p className="text-[13.5px] text-slate-700 leading-relaxed mb-4">A thymosin beta-4 fragment studied for cell migration and recovery signalling. Frequently used alongside BPC-157 in comparative and combination research designs. Independently third-party tested to &gt;99% purity.</p>
                            <div className="flex gap-3">
                                <Link to="/research-insight/tb-500" className="border border-[#214A9E] text-[#214A9E] px-5 py-1.5 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors inline-block bg-white">What is TB-500?</Link>
                                <Link to="/research-insight/bpc-157-vs-tb-500" className="border border-[#214A9E] text-[#214A9E] px-5 py-1.5 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors inline-block bg-white">BPC-157 vs TB-500</Link>
                            </div>
                        </div>

                        <div className="bg-[#f8fafc] border-l-[3px] border-[#3390ec] p-6 rounded-[4px]">
                            <span className="inline-block bg-[#e6effc] text-[#214A9E] text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider mb-2">ALPHA-MSH FRAGMENT — ANTI-INFLAMMATORY</span>
                            <h3 className="text-[14.5px] font-bold text-[#150F3A] mb-2">KPV</h3>
                            <p className="text-[13.5px] text-slate-700 leading-relaxed mb-4">A C-terminal tripeptide fragment of α-MSH studied for anti-inflammatory signalling, melanocortin receptor interactions and gut epithelial research in laboratory models. Independently third-party tested to &gt;99% purity.</p>
                            <div className="flex gap-3">
                                <Link to="/research-insight/kpv" className="border border-[#214A9E] text-[#214A9E] px-5 py-1.5 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors inline-block bg-white">What is KPV?</Link>
                                <Link to="/product/kpv" className="border border-[#214A9E] text-[#214A9E] px-5 py-1.5 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors inline-block bg-white">View Product</Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Neuropeptide Research */}
                <div className="mb-14">
                    <h2 className="text-[18px] font-bold text-[#150F3A] mb-5 border-b border-slate-200 pb-3">Neuropeptide Research</h2>
                    <div className="space-y-4">
                        <div className="bg-[#f8fafc] border-l-[3px] border-[#3390ec] p-6 rounded-[4px]">
                            <span className="inline-block bg-[#e6effc] text-[#214A9E] text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider mb-2">SYNTHETIC HEPTAPEPTIDE — GABAERGIC RESEARCH</span>
                            <h3 className="text-[14.5px] font-bold text-[#150F3A] mb-2">Selank</h3>
                            <p className="text-[13.5px] text-slate-700 leading-relaxed mb-4">A tuftsin analogue heptapeptide studied for GABAergic pathway modulation, BDNF interactions, immune-neuro crosstalk and anxiolytic-related signalling in laboratory models. Independently third-party tested to &gt;99% purity.</p>
                            <div className="flex gap-3">
                                <Link to="/research-insight/selank" className="border border-[#214A9E] text-[#214A9E] px-5 py-1.5 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors inline-block bg-white">What is Selank?</Link>
                                <Link to="/product/selank" className="border border-[#214A9E] text-[#214A9E] px-5 py-1.5 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors inline-block bg-white">View Product</Link>
                            </div>
                        </div>

                        <div className="bg-[#f8fafc] border-l-[3px] border-[#3390ec] p-6 rounded-[4px]">
                            <span className="inline-block bg-[#e6effc] text-[#214A9E] text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider mb-2">ACTH ANALOGUE — NEUROPROTECTIVE RESEARCH</span>
                            <h3 className="text-[14.5px] font-bold text-[#150F3A] mb-2">Semax</h3>
                            <p className="text-[13.5px] text-slate-700 leading-relaxed mb-4">An ACTH(4-7) analogue heptapeptide studied for BDNF upregulation, dopaminergic modulation, neuroprotective signalling and cognitive pathway research in laboratory models. Independently third-party tested to &gt;99% purity.</p>
                            <div className="flex gap-3">
                                <Link to="/research-insight/semax" className="border border-[#214A9E] text-[#214A9E] px-5 py-1.5 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors inline-block bg-white">What is Semax?</Link>
                                <Link to="/product/semax" className="border border-[#214A9E] text-[#214A9E] px-5 py-1.5 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors inline-block bg-white">View Product</Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dermal & Pigmentation Research */}
                <div className="mb-14">
                    <h2 className="text-[18px] font-bold text-[#150F3A] mb-5 border-b border-slate-200 pb-3">Dermal & Pigmentation Research</h2>
                    <div className="space-y-4">
                        <div className="bg-[#f8fafc] border-l-[3px] border-[#3390ec] p-6 rounded-[4px]">
                            <span className="inline-block bg-[#e6effc] text-[#214A9E] text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider mb-2">COPPER PEPTIDE — DERMAL RESEARCH</span>
                            <h3 className="text-[14.5px] font-bold text-[#150F3A] mb-2">GHK-Cu</h3>
                            <p className="text-[13.5px] text-slate-700 leading-relaxed mb-4">A copper peptide complex investigated in skin biology research, matrix remodelling studies and cosmetic science applications. Independently third-party tested to &gt;99% purity.</p>
                            <Link to="/research-insight/ghk-cu" className="border border-[#214A9E] text-[#214A9E] px-5 py-1.5 rounded-full text-[12px] font-semibold hover:bg-[#F0F5FB] transition-colors inline-block bg-white">What is GHK-Cu?</Link>
                        </div>
                    </div>
                </div>

                {/* Shop by Category */}
                <div className="mb-14">
                    <h2 className="text-[18px] font-bold text-[#150F3A] mb-5 border-b border-slate-200 pb-3">Shop by Category</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        <Link to="/shop?category=metabolic" className="bg-[#F0F5FB] border border-[#dbe6f5] p-4 rounded-[4px] hover:bg-[#e6effc] transition-colors">
                            <h4 className="text-[#1a4494] font-bold text-[13px] mb-1">GLP-1 & Metabolic</h4>
                            <p className="text-[11px] text-slate-500">Semaglutide, Tirzepatide, Retatrutide & more</p>
                        </Link>
                        <Link to="/shop?category=tissue" className="bg-[#F0F5FB] border border-[#dbe6f5] p-4 rounded-[4px] hover:bg-[#e6effc] transition-colors">
                            <h4 className="text-[#1a4494] font-bold text-[13px] mb-1">Tissue & Cellular</h4>
                            <p className="text-[11px] text-slate-500">BPC-157, TB-500 & repair peptides</p>
                        </Link>
                        <Link to="/shop?category=dermal" className="bg-[#F0F5FB] border border-[#dbe6f5] p-4 rounded-[4px] hover:bg-[#e6effc] transition-colors">
                            <h4 className="text-[#1a4494] font-bold text-[13px] mb-1">Dermal & Pigmentation</h4>
                            <p className="text-[11px] text-slate-500">GHK-Cu & copper peptide complexes</p>
                        </Link>
                        <Link to="/shop?category=solutions" className="bg-[#F0F5FB] border border-[#dbe6f5] p-4 rounded-[4px] hover:bg-[#e6effc] transition-colors">
                            <h4 className="text-[#1a4494] font-bold text-[13px] mb-1">Research Solutions</h4>
                            <p className="text-[11px] text-slate-500">Supporting compounds & tool materials</p>
                        </Link>
                        <Link to="/shop?category=bundles" className="bg-[#F0F5FB] border border-[#dbe6f5] p-4 rounded-[4px] hover:bg-[#e6effc] transition-colors">
                            <h4 className="text-[#1a4494] font-bold text-[13px] mb-1">Bundles</h4>
                            <p className="text-[11px] text-slate-500">Multi-compound research sets</p>
                        </Link>
                        <Link to="/shop" className="bg-[#F0F5FB] border border-[#dbe6f5] p-4 rounded-[4px] hover:bg-[#e6effc] transition-colors">
                            <h4 className="text-[#1a4494] font-bold text-[13px] mb-1">All Products</h4>
                            <p className="text-[11px] text-slate-500">Browse the full Solatide catalogue</p>
                        </Link>
                    </div>
                </div>

                {/* Quality & Documentation */}
                <div className="mb-14">
                    <h2 className="text-[18px] font-bold text-[#150F3A] mb-5 border-b border-slate-200 pb-3">Quality & Documentation</h2>
                    <div className="bg-[#F0F5FB] border-t-[3px] border-[#1a4494] p-5 rounded-b-[4px] mb-6">
                        <p className="text-[13.5px] text-slate-700 leading-relaxed">
                            <strong className="text-[#150F3A]">All Solatide Biosciences compounds are independently third-party tested to ≥99% purity</strong>, verified by HPLC analysis and mass spectrometry. Each batch is accompanied by a Certificate of Analysis documenting purity, identity confirmation and analytical testing results. <Link to="/coa" className="text-[#3390ec] hover:underline">Learn about our testing process</Link> or <Link to="/coa-reports" className="text-[#3390ec] hover:underline">view the COA library</Link>.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Link to="/resource" className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] text-[#3390ec] hover:bg-slate-50 transition-colors">
                            <span className="text-[14px]">📚</span> Resource Hub
                        </Link>
                        <Link to="/peptides-guide" className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] text-[#3390ec] hover:bg-slate-50 transition-colors">
                            <span className="text-[14px]">🧬</span> Peptide Guide
                        </Link>
                        <Link to="/calculator" className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] text-[#3390ec] hover:bg-slate-50 transition-colors">
                            <span className="text-[14px]">🧪</span> Calculator
                        </Link>
                        <Link to="/coa" className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] text-[#3390ec] hover:bg-slate-50 transition-colors">
                            <span className="text-[14px]">📄</span> COA & Testing
                        </Link>
                        <Link to="/faq" className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] text-[#3390ec] hover:bg-slate-50 transition-colors">
                            <span className="text-[14px]">❓</span> FAQ
                        </Link>
                    </div>
                </div>

                {/* Footer Disclaimer */}
                <div className="bg-[#F0F5FB] border-l-[3px] border-[#1a4494] p-5 rounded-[4px] mb-8 border-t border-slate-200">
                    <p className="text-[13.5px] text-slate-700 leading-relaxed">
                        <strong className="text-[#150F3A]">Research Use Only:</strong> All compounds are manufactured for in-vitro laboratory research and are not intended for human consumption, medical use, or veterinary applications. <Link to="/research-use" className="text-[#3390ec] hover:underline">Full disclaimer.</Link>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default CompoundDatabase;
