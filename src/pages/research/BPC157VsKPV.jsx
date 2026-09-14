import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
const Page = () => (
    <div className="min-h-screen bg-white font-sans">
        <Helmet>
            <title>BPC-157 vs KPV | Solatide Biosciences</title>
            <meta name="description" content="Comparing BPC-157 and KPV as tissue and cellular research peptides in laboratory settings. Mechanism, applications and research context differences." />
            <link rel="canonical" href="https://solatidebiosciences.com.au/pages/bpc-157-vs-kpv" />
        </Helmet>
        <section className="w-full py-4 text-center border-b border-slate-100 mb-10"><div className="main-container"><h1 className="text-[48px] md:text-[46px] font-bold text-center text-[#214A9E] leading-tight">BPC-157 vs KPV</h1></div></section>
        <div className="main-container pb-16">
            <div className="bg-[#F0F5FB] border-l-[3px] border-[#1a4494] p-5 mb-10 rounded-[4px]"><p className="text-[13.5px] text-slate-700 leading-relaxed"><strong className="text-[#150F3A]">Research Use Only:</strong> All compounds discussed are for in-vitro laboratory research only. <Link to="/pages/research-use-disclaimer" className="text-[#3390ec] hover:underline">Read our full disclaimer.</Link></p></div>
            <div className="mb-10"><h2 className="text-[18px] font-bold text-[#150F3A] mb-4 border-b border-slate-200 pb-2">Overview</h2><p className="text-[14px] text-slate-700 leading-[1.8]">BPC-157 and KPV are both researched in tissue and cellular biology contexts but target very different pathways. BPC-157 is a 15-amino acid gastric protective peptide examined for angiogenesis and growth factor modulation, while KPV is a tripeptide alpha-MSH fragment studied for melanocortin receptor interactions and anti-inflammatory pathway research.</p></div>
            <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-[#E2E8F0] rounded-[8px] p-5 bg-white"><h3 className="text-[15px] font-bold text-[#214A9E] mb-3">BPC-157</h3><ul className="list-disc pl-4 space-y-2 text-[13.5px] text-slate-700"><li>15-amino acid gastric protective peptide</li>
                        <li>Growth factor pathway research</li>
                        <li>Angiogenic signalling and tissue migration studies</li>
                        <li>Studied with repair-associated cellular pathways</li></ul></div>
                <div className="border border-[#E2E8F0] rounded-[8px] p-5 bg-white"><h3 className="text-[15px] font-bold text-[#214A9E] mb-3">KPV</h3><ul className="list-disc pl-4 space-y-2 text-[13.5px] text-slate-700"><li>Tripeptide (Lys-Pro-Val) from alpha-MSH C-terminus</li>
                        <li>Melanocortin receptor (MC1R, MC3R) interactions</li>
                        <li>Anti-inflammatory pathway research</li>
                        <li>Gut permeability and immune modulation studies</li></ul></div>
            </div>
            <div className="mb-10"><h2 className="text-[18px] font-bold text-[#150F3A] mb-4 border-b border-slate-200 pb-2">Related Resources</h2><div className="flex flex-wrap gap-3"><Link to="/products/bpc-157-10mg" className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] text-[#3390ec] hover:bg-slate-50 transition-colors">BPC-157 10mg</Link>
                    <Link to="/products/kpv-10mg" className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] text-[#3390ec] hover:bg-slate-50 transition-colors">KPV 10mg</Link>
                    <Link to="/pages/what-is-bpc-157" className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] text-[#3390ec] hover:bg-slate-50 transition-colors">What Is BPC-157?</Link>
                    <Link to="/pages/bpc-157-vs-tb-500" className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] text-[#3390ec] hover:bg-slate-50 transition-colors">BPC-157 vs TB-500</Link>
                    <Link to="/pages/research-compound-database" className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] text-[#3390ec] hover:bg-slate-50 transition-colors">Compound Index</Link></div></div>
            <div className="bg-[#F0F5FB] border-l-[3px] border-[#1a4494] p-5 rounded-[4px] mb-8"><p className="text-[13.5px] text-slate-700 leading-relaxed"><strong className="text-[#150F3A]">Research Use Only:</strong> All products are manufactured for in-vitro laboratory research and are not intended for human consumption, medical use, or veterinary applications.</p></div>
        </div>
    </div>
);
export default Page;
