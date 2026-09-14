import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const Page = () => (
    <div className="min-h-screen bg-white font-sans">
        <Helmet>
            <title>CagriSema vs Semaglutide | Solatide Biosciences</title>
            <meta name="description" content="Comparing CagriSema (cagrilintide + semaglutide) and semaglutide alone in metabolic receptor research. Dual vs single receptor engagement examined for laboratory research." />
            <link rel="canonical" href="https://solatidebiosciences.com.au/pages/cagrisema-vs-semaglutide" />
        </Helmet>
        <section className="w-full py-4 text-center border-b border-slate-100 mb-10">
            <div className="main-container">
                <h1 className="text-[48px] md:text-[46px] font-bold text-center text-[#214A9E] leading-tight">CagriSema vs Semaglutide</h1>
            </div>
        </section>
        <div className="main-container pb-16">
            <div className="bg-[#F0F5FB] border-l-[3px] border-[#1a4494] p-5 mb-10 rounded-[4px]">
                <p className="text-[13.5px] text-slate-700 leading-relaxed"><strong className="text-[#150F3A]">Research Use Only:</strong> All compounds discussed are for in-vitro laboratory research only. Not for human consumption or medical use. <Link to="/pages/research-use-disclaimer" className="text-[#3390ec] hover:underline">Read our full disclaimer.</Link></p>
            </div>
            <div className="mb-10">
                <h2 className="text-[18px] font-bold text-[#150F3A] mb-4 border-b border-slate-200 pb-2">Overview</h2>
                <p className="text-[14px] text-slate-700 leading-[1.8]">This page compares CagriSema and semaglutide in the context of laboratory metabolic research. CagriSema is a fixed-ratio combination of cagrilintide and semaglutide, designed to engage both GLP-1 and amylin receptor systems simultaneously. Semaglutide, by contrast, targets only the GLP-1 receptor. Research examines whether dual receptor engagement produces different metabolic signalling outcomes compared with GLP-1 agonism alone.</p>
            </div>
            <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-[#E2E8F0] rounded-[8px] p-5 bg-white">
                    <h3 className="text-[15px] font-bold text-[#214A9E] mb-3">CagriSema</h3>
                    <ul className="list-disc pl-4 space-y-2 text-[13.5px] text-slate-700">
                        <li>Combination of cagrilintide + semaglutide</li>
                        <li>Dual receptor engagement: GLP-1R + amylin receptor</li>
                        <li>Studied for combined satiety and metabolic pathway effects</li>
                        <li>Weekly dosing investigated in research models</li>
                        <li>Novel combination framework for metabolic research</li>
                    </ul>
                </div>
                <div className="border border-[#E2E8F0] rounded-[8px] p-5 bg-white">
                    <h3 className="text-[15px] font-bold text-[#214A9E] mb-3">Semaglutide</h3>
                    <ul className="list-disc pl-4 space-y-2 text-[13.5px] text-slate-700">
                        <li>GLP-1 receptor agonist (single receptor target)</li>
                        <li>Long-acting GLP-1 analogue with Fc-region modification</li>
                        <li>Extensively studied in insulin secretion and metabolic models</li>
                        <li>Weekly research dosing protocols in published literature</li>
                        <li>Established GLP-1 research reference compound</li>
                    </ul>
                </div>
            </div>
            <div className="mb-10">
                <h2 className="text-[18px] font-bold text-[#150F3A] mb-4 border-b border-slate-200 pb-2">Related Resources</h2>
                <div className="flex flex-wrap gap-3">
                    <Link to="/products/cagrisema-10mg" className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] text-[#3390ec] hover:bg-slate-50 transition-colors">CagriSema 10mg</Link>
                    <Link to="/products/semaglutide-5mg" className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] text-[#3390ec] hover:bg-slate-50 transition-colors">Semaglutide 5mg</Link>
                    <Link to="/pages/glp-1-research-overview" className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] text-[#3390ec] hover:bg-slate-50 transition-colors">GLP-1 Research Overview</Link>
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
