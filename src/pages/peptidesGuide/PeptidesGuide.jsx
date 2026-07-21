import React from 'react';
import { Link } from 'react-router-dom';

const PeptidesGuide = () => {
    return (
        <div className="min-h-screen bg-white font-sans">
            <section className="w-full py-8 text-center border-b border-slate-100 mb-10">
                <div className="main-container">
                    <h1 className="text-[48px] md:text-[46px] font-bold text-center text-[#214A9E] leading-tight">
                        Research Peptide Guide
                    </h1>
                </div>
            </section>
            
            <div className="main-container pb-16">
                {/* Top Disclaimer */}
                <div className="bg-[#F0F5FB] border-l-[3px] border-[#1a4494] p-5 mb-14 rounded-[4px]">
                    <p className="text-[13.5px] text-slate-700 leading-relaxed">
                        <strong className="text-[#150F3A]">Research Use Only:</strong> All peptides and compounds discussed on this page are intended strictly for in-vitro laboratory research purposes only. Not for human consumption, medical treatment, or veterinary use. <Link to="/research-use" className="text-[#3390ec] hover:underline">Read our full disclaimer.</Link>
                    </p>
                </div>

                <div className="mb-14">
                    <h2 className="text-[22px] font-bold text-[#214A9E] mb-4">Research Peptide Guide</h2>
                    <p className="text-[14px] text-slate-700 mb-6 leading-[1.8]">
                        A plain-language guide to research peptides, covering common categories, laboratory use, handling considerations, quality documentation and research-use terminology. If you already know the compound you need, use the <Link to="/compound-database" className="text-[#3390ec] hover:underline">Compound Index</Link> instead.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link to="/compound-database" className="bg-[#1a4494] text-white px-6 py-2.5 rounded-full text-[13px] font-semibold hover:bg-[#163678] transition-colors shadow-sm">Browse the Compound Index</Link>
                        <Link to="/research-resource" className="border border-[#1a4494] text-[#1a4494] px-6 py-2.5 rounded-full text-[13px] font-semibold hover:bg-[#F0F5FB] transition-colors">All Research Resources</Link>
                    </div>
                </div>

                <div className="mb-14">
                    <h2 className="text-[18px] font-bold text-[#150F3A] mb-5 border-b border-slate-200 pb-3">What Are Research Peptides?</h2>
                    <div className="space-y-4 text-[14px] text-slate-700 leading-[1.8]">
                        <p>Research peptides are laboratory compounds used to investigate receptor interactions, signalling pathways, cellular responses and other controlled experimental questions in vitro. The category includes metabolic peptides, growth hormone secretagogues, repair-oriented compounds, neuropeptides, mitochondrial peptides, dermal research peptides and related laboratory support materials used across different investigative settings.</p>
                        <p>Peptides typically consist of 2-50 amino acids linked by peptide bonds, distinguishing them from larger proteins. Their relatively small size and specific biological activity make them valuable for studying targeted biochemical processes without the complexity of full protein structures.</p>
                    </div>
                </div>

                <div className="mb-14">
                    <h2 className="text-[18px] font-bold text-[#150F3A] mb-5 border-b border-slate-200 pb-3">Research Use Only</h2>
                    <p className="text-[14px] text-slate-700 leading-[1.8]">
                        All compounds available through Solatide Biosciences are manufactured and distributed exclusively for in-vitro laboratory research. They are not approved for human consumption, medical treatment, or veterinary applications. Researchers should operate under appropriate institutional oversight and follow all applicable biosafety guidelines. <Link to="/research-use" className="text-[#3390ec] hover:underline">Read the full Research Use Disclaimer.</Link>
                    </p>
                </div>

                <div className="mb-14">
                    <h2 className="text-[18px] font-bold text-[#150F3A] mb-5 border-b border-slate-200 pb-3">Broad Peptide Categories</h2>

                    <div className="space-y-4">
                        <div className="bg-[#F8FAFC] border-l-[3px] border-[#3390ec] p-6 rounded-[4px]">
                            <h3 className="text-[14.5px] font-bold text-[#150F3A] mb-2">Metabolic Research Peptides</h3>
                            <p className="text-[13.5px] text-slate-700 leading-relaxed">Used to investigate energy regulation, glucose metabolism and lipid processing in laboratory models. Includes GLP-1, GIP and glucagon receptor agonists such as Semaglutide, Tirzepatide, Retatrutide and CagriSema. <Link to="/research-insight/glp-1" className="text-[#3390ec] hover:underline">GLP-1 Research Overview</Link></p>
                        </div>

                        <div className="bg-[#F8FAFC] border-l-[3px] border-[#3390ec] p-6 rounded-[4px]">
                            <h3 className="text-[14.5px] font-bold text-[#150F3A] mb-2">Growth Hormone Axis Peptides</h3>
                            <p className="text-[13.5px] text-slate-700 leading-relaxed">GHRH analogues and GH secretagogues used to study growth hormone secretion, pituitary somatotroph signalling and the GH/IGF-1 axis in laboratory models. Key compounds include Tesamorelin, CJC-1295 No DAC and Ipamorelin. <Link to="/research-insight/tesamorelin" className="text-[#3390ec] hover:underline">Tesamorelin Overview</Link></p>
                        </div>

                        <div className="bg-[#F8FAFC] border-l-[3px] border-[#3390ec] p-6 rounded-[4px]">
                            <h3 className="text-[14.5px] font-bold text-[#150F3A] mb-2">Mitochondrial & Cellular Energy Peptides</h3>
                            <p className="text-[13.5px] text-slate-700 leading-relaxed">Compounds studied for mitochondrial function, cellular energy production and metabolic regulation. Includes MOTS-c (mitochondrial-derived peptide), SS-31 (Elamipretide) and NAD+ (coenzyme). <Link to="/research-insight/mots-c" className="text-[#3390ec] hover:underline">MOTS-c Overview</Link></p>
                        </div>

                        <div className="bg-[#F8FAFC] border-l-[3px] border-[#3390ec] p-6 rounded-[4px]">
                            <h3 className="text-[14.5px] font-bold text-[#150F3A] mb-2">Repair & Recovery Peptides</h3>
                            <p className="text-[13.5px] text-slate-700 leading-relaxed">Studied for roles in cellular repair mechanisms, tissue response pathways and recovery-related signalling. BPC-157 and TB-500 are the most widely referenced compounds in this category. <Link to="/research-insight/bpc-157" className="text-[#3390ec] hover:underline">What Is BPC-157?</Link></p>
                        </div>

                        <div className="bg-[#F8FAFC] border-l-[3px] border-[#3390ec] p-6 rounded-[4px]">
                            <h3 className="text-[14.5px] font-bold text-[#150F3A] mb-2">Neuropeptides</h3>
                            <p className="text-[13.5px] text-slate-700 leading-relaxed">Synthetic peptides studied for neuromodulatory, neuroprotective and cognitive pathway research in laboratory models. Includes Selank (GABAergic/anxiolytic research) and Semax (BDNF upregulation/dopaminergic research). <Link to="/research-insight/selank" className="text-[#3390ec] hover:underline">Selank Overview</Link></p>
                        </div>

                        <div className="bg-[#F8FAFC] border-l-[3px] border-[#3390ec] p-6 rounded-[4px]">
                            <h3 className="text-[14.5px] font-bold text-[#150F3A] mb-2">Anti-Inflammatory & Immune Peptides</h3>
                            <p className="text-[13.5px] text-slate-700 leading-relaxed">Peptides studied for inflammatory pathway modulation, immune signalling and epithelial research in laboratory models. KPV (alpha-MSH fragment) is the primary compound in this category. <Link to="/research-insight/kpv" className="text-[#3390ec] hover:underline">KPV Overview</Link></p>
                        </div>

                        <div className="bg-[#F8FAFC] border-l-[3px] border-[#3390ec] p-6 rounded-[4px]">
                            <h3 className="text-[14.5px] font-bold text-[#150F3A] mb-2">Dermal & Copper Peptides</h3>
                            <p className="text-[13.5px] text-slate-700 leading-relaxed">Investigated in skin biology research, matrix remodelling studies and cosmetic science applications. GHK-Cu is the primary copper peptide complex in this category. <Link to="/research-insight/ghk-cu" className="text-[#3390ec] hover:underline">What Is GHK-Cu?</Link></p>
                        </div>
                    </div>
                </div>

                <div className="mb-14">
                    <h2 className="text-[18px] font-bold text-[#150F3A] mb-5 border-b border-slate-200 pb-3">Storage & Handling Basics</h2>

                    <div className="space-y-6 text-[14px]">
                        <div>
                            <h4 className="font-bold text-[#150F3A] mb-2 text-[14.5px]">Storage</h4>
                            <p className="text-slate-700 leading-[1.8]">Lyophilised research peptides should be stored at -20°C or -80°C, protected from light and moisture, and handled according to institutional laboratory protocols. Small molecules such as 5-Amino-1MQ and NAD+ have specific storage requirements. Always consult the product page and COA for compound-specific guidance.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-[#150F3A] mb-2 text-[14.5px]">Reconstitution</h4>
                            <p className="text-slate-700 leading-[1.8]">Lyophilised peptides require reconstitution prior to use. Use the <Link to="/calculator" className="text-[#3390ec] hover:underline">Concentration Calculator</Link> to determine the correct solvent volume for your target concentration.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-[#150F3A] mb-2 text-[14.5px]">Handling Precautions</h4>
                            <p className="text-slate-700 leading-[1.8]">Follow standard laboratory safety protocols including appropriate PPE, designated laboratory spaces and institutional biosafety guidelines. <Link to="/contact" className="text-[#3390ec] hover:underline">Contact us</Link> if you have questions about a specific compound.</p>
                        </div>
                    </div>
                </div>

                <div className="mb-14">
                    <h2 className="text-[18px] font-bold text-[#150F3A] mb-5 border-b border-slate-200 pb-3">Quality Documentation & Testing</h2>
                    <p className="text-[14px] text-slate-700 mb-6 leading-[1.8]">
                        All Solatide Biosciences compounds are independently third-party tested to &gt;=99% purity, verified by HPLC analysis and mass spectrometry. Certificates of Analysis are published on each product page where available.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link to="/coa" className="bg-[#1a4494] text-white px-6 py-2.5 rounded-full text-[13px] font-semibold hover:bg-[#163678] transition-colors shadow-sm">COA & Lab Testing</Link>
                        <Link to="/coa-reports" className="border border-[#1a4494] text-[#1a4494] px-6 py-2.5 rounded-full text-[13px] font-semibold hover:bg-[#F0F5FB] transition-colors">View COA Library</Link>
                    </div>
                </div>

                <div className="mb-14">
                    <h2 className="text-[18px] font-bold text-[#150F3A] mb-5 border-b border-slate-200 pb-3">Regulatory & Compliance Context</h2>

                    <div className="space-y-6 text-[14px]">
                        <div>
                            <h4 className="font-bold text-[#150F3A] mb-2 text-[14.5px]">Institutional Oversight</h4>
                            <p className="text-slate-700 leading-[1.8]">Research involving peptides, particularly in animal models, must be conducted under appropriate institutional oversight including IACUC approval or equivalent ethics review.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-[#150F3A] mb-2 text-[14.5px]">Documentation & Traceability</h4>
                            <p className="text-slate-700 leading-[1.8]">Maintaining detailed records of peptide sourcing, storage, handling and experimental use is essential for research integrity and regulatory compliance. Solatide Biosciences publishes batch-level COA documentation where available. <Link to="/coa" className="text-[#3390ec] hover:underline">Learn more</Link></p>
                        </div>
                    </div>
                </div>

                <div className="mb-14">
                    <h2 className="text-[18px] font-bold text-[#150F3A] mb-5 border-b border-slate-200 pb-3">Ready to Find a Specific Compound?</h2>
                    <p className="text-[14px] text-slate-700 mb-6 leading-[1.8]">
                        The Compound Index lists all available research compounds by name, category and receptor pathway, with links to product pages and batch documentation.
                    </p>
                    <div className="flex flex-wrap gap-4 mb-8">
                        <Link to="/compound-database" className="bg-[#1a4494] text-white px-6 py-2.5 rounded-full text-[13px] font-semibold hover:bg-[#163678] transition-colors shadow-sm">Browse the Compound Index</Link>
                        <Link to="/research-resource" className="border border-[#1a4494] text-[#1a4494] px-6 py-2.5 rounded-full text-[13px] font-semibold hover:bg-[#F0F5FB] transition-colors">All Research Resources</Link>
                    </div>

                    <div className="flex flex-wrap gap-3 mb-12">
                        <Link to="/calculator" className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] text-[#3390ec] hover:bg-slate-50 transition-colors">
                            <span className="text-[14px]">🧪</span> Concentration Calculator
                        </Link>
                        <Link to="/coa" className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] text-[#3390ec] hover:bg-slate-50 transition-colors">
                            <span className="text-[14px]">📄</span> COA & Lab Testing
                        </Link>
                        <Link to="/faq" className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] text-[#3390ec] hover:bg-slate-50 transition-colors">
                            <span className="text-[14px]">❓</span> FAQ
                        </Link>
                        <Link to="/contact" className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] text-[#3390ec] hover:bg-slate-50 transition-colors">
                            <span className="text-[14px]">✉️</span> Contact Us
                        </Link>
                        <Link to="/research-use" className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] text-[#3390ec] hover:bg-slate-50 transition-colors">
                            <span className="text-[14px]">⚠️</span> Research Use Disclaimer
                        </Link>
                    </div>

                    <div className="bg-[#F0F5FB] border-l-[3px] border-[#1a4494] p-5 rounded-[4px]">
                        <p className="text-[13.5px] text-slate-700 leading-relaxed">
                            <strong className="text-[#150F3A]">Research Use Only:</strong> All peptides are manufactured for in-vitro laboratory research and are not intended for human consumption, medical use, or veterinary applications. <Link to="/research-use" className="text-[#3390ec] hover:underline">Full disclaimer.</Link>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PeptidesGuide;
