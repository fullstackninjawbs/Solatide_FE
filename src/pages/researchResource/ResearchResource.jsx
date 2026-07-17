import React from 'react';
import { Link } from 'react-router-dom';

const ResearchResource = () => {
    return (
        <div className="min-h-screen bg-white pt-24 pb-16 font-sans">
            <div className="main-container">
                <h1 className="text-3xl md:text-[38px] font-bold text-center text-[#214A9E] mb-10 tracking-tight">
                    Research Resource Hub
                </h1>

                {/* Top Disclaimer */}
                <div className="bg-[#F0F5FB] border-l-[3px] border-[#1a4494] p-5 mb-14 rounded-[4px]">
                    <p className="text-[13.5px] text-slate-700 leading-relaxed">
                        <strong className="text-[#150F3A]">Research Use Only:</strong> All compounds and materials referenced across this site are intended strictly for in-vitro laboratory research purposes only. Not for human consumption, medical treatment, or veterinary use. <Link to="/research-use" className="text-[#3390ec] hover:underline">Read our full disclaimer.</Link>
                    </p>
                </div>

                {/* Intro Section */}
                <div className="mb-14">
                    <h2 className="text-[20px] font-bold text-[#214A9E] mb-4">Research Resource Hub</h2>
                    <p className="text-[14px] text-slate-700 mb-6 leading-[1.8]">
                        Explore Solatide's research resources — including peptide education, compound references, batch documentation, COA guidance and laboratory calculation tools.
                    </p>
                </div>

                {/* Resource Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {/* Card 1 */}
                    <div className="bg-[#f8fafc] border-l-[3px] border-[#3390ec] p-7 rounded-[4px] flex flex-col h-full">
                        <span className="text-[#3390ec] text-[10px] font-bold uppercase tracking-wider mb-2">START HERE</span>
                        <h3 className="text-[15.5px] font-bold text-[#150F3A] mb-3">Research Peptide Guide</h3>
                        <p className="text-[13.5px] text-slate-600 leading-relaxed mb-6 flex-grow">
                            New to research peptides? This plain-language guide covers categories, terminology, storage, handling and research-use context.
                        </p>
                        <Link to="/peptides-guide" className="text-[#3390ec] text-[13px] font-semibold hover:underline inline-flex items-center gap-1">
                            Read the guide <span>→</span>
                        </Link>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-[#f8fafc] border-l-[3px] border-[#3390ec] p-7 rounded-[4px] flex flex-col h-full">
                        <span className="text-[#3390ec] text-[10px] font-bold uppercase tracking-wider mb-2">FIND A COMPOUND</span>
                        <h3 className="text-[15.5px] font-bold text-[#150F3A] mb-3">Compound Index</h3>
                        <p className="text-[13.5px] text-slate-600 leading-relaxed mb-6 flex-grow">
                            Browse all available research compounds by name, category and receptor pathway. Links to product pages and batch documentation.
                        </p>
                        <Link to="/compound-database" className="text-[#3390ec] text-[13px] font-semibold hover:underline inline-flex items-center gap-1">
                            Browse compounds <span>→</span>
                        </Link>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-[#f8fafc] border-l-[3px] border-[#3390ec] p-7 rounded-[4px] flex flex-col h-full">
                        <span className="text-[#3390ec] text-[10px] font-bold uppercase tracking-wider mb-2">DOCUMENTATION</span>
                        <h3 className="text-[15.5px] font-bold text-[#150F3A] mb-3">COA & Lab Testing</h3>
                        <p className="text-[13.5px] text-slate-600 leading-relaxed mb-6 flex-grow">
                            How Solatide's compounds are tested, what our Certificates of Analysis include, and how to interpret purity and identity data.
                        </p>
                        <Link to="/coa" className="text-[#3390ec] text-[13px] font-semibold hover:underline inline-flex items-center gap-1">
                            View testing info <span>→</span>
                        </Link>
                    </div>

                    {/* Card 4 */}
                    <div className="bg-[#f8fafc] border-l-[3px] border-[#3390ec] p-7 rounded-[4px] flex flex-col h-full">
                        <span className="text-[#3390ec] text-[10px] font-bold uppercase tracking-wider mb-2">DOCUMENTATION</span>
                        <h3 className="text-[15.5px] font-bold text-[#150F3A] mb-3">Certificates of Analysis</h3>
                        <p className="text-[13.5px] text-slate-600 leading-relaxed mb-6 flex-grow">
                            Access third-party analytical documentation for available Solatide products and batches, including purity, identity and endotoxin data.
                        </p>
                        <Link to="/coa-reports" className="text-[#3390ec] text-[13px] font-semibold hover:underline inline-flex items-center gap-1">
                            View COA library <span>→</span>
                        </Link>
                    </div>

                    {/* Card 5 */}
                    <div className="bg-[#f8fafc] border-l-[3px] border-[#3390ec] p-7 rounded-[4px] flex flex-col h-full">
                        <span className="text-[#3390ec] text-[10px] font-bold uppercase tracking-wider mb-2">TOOLS</span>
                        <h3 className="text-[15.5px] font-bold text-[#150F3A] mb-3">Concentration Calculator</h3>
                        <p className="text-[13.5px] text-slate-600 leading-relaxed mb-6 flex-grow">
                            Calculate the correct solvent volume for your target concentration when reconstituting lyophilised peptides.
                        </p>
                        <Link to="/calculator" className="text-[#3390ec] text-[13px] font-semibold hover:underline inline-flex items-center gap-1">
                            Open calculator <span>→</span>
                        </Link>
                    </div>

                    {/* Card 6 */}
                    <div className="bg-[#f8fafc] border-l-[3px] border-[#3390ec] p-7 rounded-[4px] flex flex-col h-full">
                        <span className="text-[#3390ec] text-[10px] font-bold uppercase tracking-wider mb-2">HELP</span>
                        <h3 className="text-[15.5px] font-bold text-[#150F3A] mb-3">FAQ</h3>
                        <p className="text-[13.5px] text-slate-600 leading-relaxed mb-6 flex-grow">
                            Answers to common questions about ordering, shipping, storage, documentation and research-use compliance.
                        </p>
                        <Link to="/faq" className="text-[#3390ec] text-[13px] font-semibold hover:underline inline-flex items-center gap-1">
                            Read the FAQ <span>→</span>
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ResearchResource;
