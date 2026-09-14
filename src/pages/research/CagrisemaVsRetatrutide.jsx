import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const Page = () => (
    <div className="min-h-screen bg-white font-sans">
        <Helmet>
            <title>CagriSema vs Retatrutide | Solatide Biosciences</title>
            <meta name="description" content="Comparing CagriSema dual receptor combination and retatrutide triple receptor agonist in metabolic research models. For in-vitro research use only." />
            <link rel="canonical" href="https://solatidebiosciences.com.au/pages/cagrisema-vs-retatrutide" />
        </Helmet>
        <section className="w-full py-4 text-center border-b border-slate-100 mb-10">
            <div className="main-container">
                <h1 className="text-[48px] md:text-[46px] font-bold text-center text-[#214A9E] leading-tight">CagriSema vs Retatrutide</h1>
            </div>
        </section>
        <div className="main-container pb-16">
            <div className="bg-[#F0F5FB] border-l-[3px] border-[#1a4494] p-5 mb-10 rounded-[4px]">
                <p className="text-[13.5px] text-slate-700 leading-relaxed"><strong className="text-[#150F3A]">Research Use Only:</strong> All compounds discussed are for in-vitro laboratory research only. Not for human consumption or medical use. <Link to="/pages/research-use-disclaimer" className="text-[#3390ec] hover:underline">Read our full disclaimer.</Link></p>
            </div>
            <div className="mb-10">
                <h2 className="text-[18px] font-bold text-[#150F3A] mb-4 border-b border-slate-200 pb-2">Overview</h2>
                <p className="text-[14px] text-slate-700 leading-[1.8]">CagriSema and retatrutide represent two different multi-receptor metabolic research frameworks. CagriSema targets GLP-1 and amylin receptors as a combination therapy, while retatrutide is a single molecule that engages GLP-1, GIP, and glucagon receptors. Research examines the pharmacological distinctions between these dual and triple receptor approaches.</p>
            </div>
            <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-[#E2E8F0] rounded-[8px] p-5 bg-white">
                    <h3 className="text-[15px] font-bold text-[#214A9E] mb-3">CagriSema</h3>
                    <ul className="list-disc pl-4 space-y-2 text-[13.5px] text-slate-700">
                        <li>GLP-1R + amylin receptor dual engagement</li>
                        <li>Two-compound combination formulation</li>
                        <li>Satiety and complement pathway focused</li>
                        <li>Novel research combination compound</li>
                    </ul>
                </div>
                <div className="border border-[#E2E8F0] rounded-[8px] p-5 bg-white">
                    <h3 className="text-[15px] font-bold text-[#214A9E] mb-3">Retatrutide</h3>
                    <ul className="list-disc pl-4 space-y-2 text-[13.5px] text-slate-700">
                        <li>GLP-1R + GIPR + GcgR triple agonist (single molecule)</li>
                        <li>Hepatic glucose output via glucagon receptor</li>
                        <li>Most receptor-complex metabolic research peptide</li>
                        <li>Studied for energy expenditure and lipid oxidation</li>
                    </ul>
                </div>
            </div>
            <div className="mb-10">
                <h2 className="text-[18px] font-bold text-[#150F3A] mb-4 border-b border-slate-200 pb-2">Related Resources</h2>
                <div className="flex flex-wrap gap-3">
                    <Link to="/products/cagrisema-10mg" className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] text-[#3390ec] hover:bg-slate-50 transition-colors">CagriSema 10mg</Link>
                    <Link to="/products/retatrutide-5mg" className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] text-[#3390ec] hover:bg-slate-50 transition-colors">Retatrutide 5mg</Link>
                    <Link to="/pages/retatrutide-research-overview" className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] text-[#3390ec] hover:bg-slate-50 transition-colors">Retatrutide Overview</Link>
                    <Link to="/pages/cagrisema-research-overview" className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] text-[#3390ec] hover:bg-slate-50 transition-colors">CagriSema Overview</Link>
                </div>
            </div>
            <div className="bg-[#F0F5FB] border-l-[3px] border-[#1a4494] p-5 rounded-[4px] mb-8">
                <p className="text-[13.5px] text-slate-700 leading-relaxed"><strong className="text-[#150F3A]">Research Use Only:</strong> All products are manufactured for in-vitro laboratory research and are not intended for human consumption, medical use, or veterinary applications.</p>
            </div>
        </div>
    </div>
);
export default Page;
