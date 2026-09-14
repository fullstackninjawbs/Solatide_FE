import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const Page = () => (
    <div className="min-h-screen bg-white font-sans">
        <Helmet>
            <title>CagriSema vs Tirzepatide | Solatide Biosciences</title>
            <meta name="description" content="Comparing CagriSema dual receptor combination and tirzepatide (GLP-1/GIP dual agonist) in metabolic research. For in-vitro research use only." />
            <link rel="canonical" href="https://solatidebiosciences.com.au/pages/cagrisema-vs-tirzepatide" />
        </Helmet>
        <section className="w-full py-4 text-center border-b border-slate-100 mb-10">
            <div className="main-container">
                <h1 className="text-[48px] md:text-[46px] font-bold text-center text-[#214A9E] leading-tight">CagriSema vs Tirzepatide</h1>
            </div>
        </section>
        <div className="main-container pb-16">
            <div className="bg-[#F0F5FB] border-l-[3px] border-[#1a4494] p-5 mb-10 rounded-[4px]">
                <p className="text-[13.5px] text-slate-700 leading-relaxed"><strong className="text-[#150F3A]">Research Use Only:</strong> All compounds discussed are for in-vitro laboratory research only. Not for human consumption or medical use. <Link to="/pages/research-use-disclaimer" className="text-[#3390ec] hover:underline">Read our full disclaimer.</Link></p>
            </div>
            <div className="mb-10">
                <h2 className="text-[18px] font-bold text-[#150F3A] mb-4 border-b border-slate-200 pb-2">Overview</h2>
                <p className="text-[14px] text-slate-700 leading-[1.8]">CagriSema combines a GLP-1 receptor agonist with an amylin receptor agonist, while tirzepatide co-activates GLP-1 and GIP receptors. Research examines whether different dual-receptor combinations produce distinct metabolic signalling profiles in laboratory models.</p>
            </div>
            <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-[#E2E8F0] rounded-[8px] p-5 bg-white">
                    <h3 className="text-[15px] font-bold text-[#214A9E] mb-3">CagriSema</h3>
                    <ul className="list-disc pl-4 space-y-2 text-[13.5px] text-slate-700">
                        <li>GLP-1R + amylin receptor dual engagement</li>
                        <li>Combination framework (cagrilintide + semaglutide)</li>
                        <li>Satiety and gastric emptying focused</li>
                        <li>Novel research combination compound</li>
                    </ul>
                </div>
                <div className="border border-[#E2E8F0] rounded-[8px] p-5 bg-white">
                    <h3 className="text-[15px] font-bold text-[#214A9E] mb-3">Tirzepatide</h3>
                    <ul className="list-disc pl-4 space-y-2 text-[13.5px] text-slate-700">
                        <li>GLP-1R + GIPR dual agonist (single molecule)</li>
                        <li>Incretin-focused dual receptor framework</li>
                        <li>Insulin secretion and metabolic signalling studied</li>
                        <li>More established research profile in dual agonist literature</li>
                    </ul>
                </div>
            </div>
            <div className="mb-10">
                <h2 className="text-[18px] font-bold text-[#150F3A] mb-4 border-b border-slate-200 pb-2">Related Resources</h2>
                <div className="flex flex-wrap gap-3">
                    <Link to="/products/cagrisema-10mg" className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] text-[#3390ec] hover:bg-slate-50 transition-colors">CagriSema 10mg</Link>
                    <Link to="/products/tirzepatide-5mg" className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] text-[#3390ec] hover:bg-slate-50 transition-colors">Tirzepatide 5mg</Link>
                    <Link to="/pages/glp-1-research-overview" className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] text-[#3390ec] hover:bg-slate-50 transition-colors">GLP-1 Overview</Link>
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
