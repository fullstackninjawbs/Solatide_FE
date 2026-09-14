import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
const Page = () => (
    <div className="min-h-screen bg-white font-sans">
        <Helmet>
            <title>NAD+ vs MOTS-c | Solatide Biosciences</title>
            <meta name="description" content="Comparing NAD+ coenzyme and MOTS-c mitochondria-derived peptide in metabolic and mitochondrial research. Different mechanisms but related research contexts." />
            <link rel="canonical" href="https://solatidebiosciences.com.au/pages/nad-plus-vs-mots-c" />
        </Helmet>
        <section className="w-full py-4 text-center border-b border-slate-100 mb-10"><div className="main-container"><h1 className="text-[48px] md:text-[46px] font-bold text-center text-[#214A9E] leading-tight">NAD+ vs MOTS-c</h1></div></section>
        <div className="main-container pb-16">
            <div className="bg-[#F0F5FB] border-l-[3px] border-[#1a4494] p-5 mb-10 rounded-[4px]"><p className="text-[13.5px] text-slate-700 leading-relaxed"><strong className="text-[#150F3A]">Research Use Only:</strong> All compounds discussed are for in-vitro laboratory research only. <Link to="/pages/research-use-disclaimer" className="text-[#3390ec] hover:underline">Read our full disclaimer.</Link></p></div>
            <div className="mb-10"><h2 className="text-[18px] font-bold text-[#150F3A] mb-4 border-b border-slate-200 pb-2">Overview</h2><p className="text-[14px] text-slate-700 leading-[1.8]">NAD+ and MOTS-c are both studied in mitochondrial and metabolic research contexts, but they represent entirely different molecular classes. NAD+ is a coenzyme central to redox reactions and sirtuin activation research, while MOTS-c is a mitochondria-derived peptide that acts as a retrograde signalling molecule affecting nuclear gene expression and AMPK pathways.</p></div>
            <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-[#E2E8F0] rounded-[8px] p-5 bg-white"><h3 className="text-[15px] font-bold text-[#214A9E] mb-3">NAD+ (Nicotinamide Adenine Dinucleotide)</h3><ul className="list-disc pl-4 space-y-2 text-[13.5px] text-slate-700"><li>Coenzyme found in all living cells</li>
                        <li>Central to cellular energy metabolism (redox)</li>
                        <li>Sirtuin (SIRT1-7) activation research</li>
                        <li>DNA repair pathway and ageing model studies</li></ul></div>
                <div className="border border-[#E2E8F0] rounded-[8px] p-5 bg-white"><h3 className="text-[15px] font-bold text-[#214A9E] mb-3">MOTS-c</h3><ul className="list-disc pl-4 space-y-2 text-[13.5px] text-slate-700"><li>Mitochondria-derived peptide (16 amino acids)</li>
                        <li>Retrograde mitochondria-to-nucleus signalling</li>
                        <li>AMPK pathway activation research</li>
                        <li>Exercise response and glucose metabolism models</li></ul></div>
            </div>
            <div className="mb-10"><h2 className="text-[18px] font-bold text-[#150F3A] mb-4 border-b border-slate-200 pb-2">Related Resources</h2><div className="flex flex-wrap gap-3"><Link to="/products/nad-500mg" className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] text-[#3390ec] hover:bg-slate-50 transition-colors">NAD+ 500mg</Link>
                    <Link to="/products/mots-c-10mg" className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] text-[#3390ec] hover:bg-slate-50 transition-colors">MOTS-c 10mg</Link>
                    <Link to="/pages/what-is-mots-c" className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] text-[#3390ec] hover:bg-slate-50 transition-colors">What Is MOTS-c?</Link>
                    <Link to="/pages/what-is-nad-plus" className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] text-[#3390ec] hover:bg-slate-50 transition-colors">What Is NAD+?</Link>
                    <Link to="/pages/research-compound-database" className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] text-[#3390ec] hover:bg-slate-50 transition-colors">Compound Index</Link></div></div>
            <div className="bg-[#F0F5FB] border-l-[3px] border-[#1a4494] p-5 rounded-[4px] mb-8"><p className="text-[13.5px] text-slate-700 leading-relaxed"><strong className="text-[#150F3A]">Research Use Only:</strong> All products are manufactured for in-vitro laboratory research and are not intended for human consumption, medical use, or veterinary applications.</p></div>
        </div>
    </div>
);
export default Page;
