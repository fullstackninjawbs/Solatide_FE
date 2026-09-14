import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
const Page = () => (
    <div className="min-h-screen bg-white font-sans">
        <Helmet>
            <title>MOTS-c vs SS-31 | Solatide Biosciences</title>
            <meta name="description" content="Comparing MOTS-c and SS-31 (Elamipretide) as mitochondria-derived peptides in research. Energy metabolism vs membrane stabilisation." />
            <link rel="canonical" href="https://solatidebiosciences.com.au/pages/mots-c-vs-ss-31" />
        </Helmet>
        <section className="w-full py-4 text-center border-b border-slate-100 mb-10"><div className="main-container"><h1 className="text-[48px] md:text-[46px] font-bold text-center text-[#214A9E] leading-tight">MOTS-c vs SS-31</h1></div></section>
        <div className="main-container pb-16">
            <div className="bg-[#F0F5FB] border-l-[3px] border-[#1a4494] p-5 mb-10 rounded-[4px]"><p className="text-[13.5px] text-slate-700 leading-relaxed"><strong className="text-[#150F3A]">Research Use Only:</strong> All compounds discussed are for in-vitro laboratory research only. <Link to="/pages/research-use-disclaimer" className="text-[#3390ec] hover:underline">Read our full disclaimer.</Link></p></div>
            <div className="mb-10"><h2 className="text-[18px] font-bold text-[#150F3A] mb-4 border-b border-slate-200 pb-2">Overview</h2><p className="text-[14px] text-slate-700 leading-[1.8]">MOTS-c and SS-31 are both classified as mitochondria-related research peptides, but they act on mitochondrial biology through entirely different mechanisms. MOTS-c is a mitochondria-derived peptide that engages nuclear gene expression and AMPK pathway signalling, while SS-31 (Elamipretide) is a synthetic mitochondrial targeting peptide that associates with the inner mitochondrial membrane and cardiolipin.</p></div>
            <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-[#E2E8F0] rounded-[8px] p-5 bg-white"><h3 className="text-[15px] font-bold text-[#214A9E] mb-3">MOTS-c</h3><ul className="list-disc pl-4 space-y-2 text-[13.5px] text-slate-700"><li>Mitochondria-derived peptide (MDP)</li>
                        <li>Encoded by 12S rRNA gene (mitochondrial DNA)</li>
                        <li>AMPK and metabolic pathway signalling</li>
                        <li>Glucose metabolism and exercise model research</li></ul></div>
                <div className="border border-[#E2E8F0] rounded-[8px] p-5 bg-white"><h3 className="text-[15px] font-bold text-[#214A9E] mb-3">SS-31 (Elamipretide)</h3><ul className="list-disc pl-4 space-y-2 text-[13.5px] text-slate-700"><li>Synthetic mitochondrial targeting peptide</li>
                        <li>Cardiolipin binding and membrane stabilisation</li>
                        <li>ROS scavenging and oxidative stress research</li>
                        <li>Energy production and mitochondrial integrity studies</li></ul></div>
            </div>
            <div className="mb-10"><h2 className="text-[18px] font-bold text-[#150F3A] mb-4 border-b border-slate-200 pb-2">Related Resources</h2><div className="flex flex-wrap gap-3"><Link to="/products/mots-c-10mg" className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] text-[#3390ec] hover:bg-slate-50 transition-colors">MOTS-c 10mg</Link>
                    <Link to="/products/ss-31-elamipretide-10mg-lyophilised-peptide" className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] text-[#3390ec] hover:bg-slate-50 transition-colors">SS-31 10mg</Link>
                    <Link to="/pages/what-is-mots-c" className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] text-[#3390ec] hover:bg-slate-50 transition-colors">What Is MOTS-c?</Link>
                    <Link to="/pages/what-is-ss-31" className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] text-[#3390ec] hover:bg-slate-50 transition-colors">What Is SS-31?</Link>
                    <Link to="/pages/research-compound-database" className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] text-[#3390ec] hover:bg-slate-50 transition-colors">Compound Index</Link></div></div>
            <div className="bg-[#F0F5FB] border-l-[3px] border-[#1a4494] p-5 rounded-[4px] mb-8"><p className="text-[13.5px] text-slate-700 leading-relaxed"><strong className="text-[#150F3A]">Research Use Only:</strong> All products are manufactured for in-vitro laboratory research and are not intended for human consumption, medical use, or veterinary applications.</p></div>
        </div>
    </div>
);
export default Page;
