import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
const Page = () => (
    <div className="min-h-screen bg-white font-sans">
        <Helmet>
            <title>Selank vs Semax | Solatide Biosciences</title>
            <meta name="description" content="Comparing Selank and Semax as neuropeptides in laboratory research. Different receptor mechanisms, structures and research applications." />
            <link rel="canonical" href="https://solatidebiosciences.com.au/pages/selank-vs-semax" />
        </Helmet>
        <section className="w-full py-4 text-center border-b border-slate-100 mb-10"><div className="main-container"><h1 className="text-[48px] md:text-[46px] font-bold text-center text-[#214A9E] leading-tight">Selank vs Semax</h1></div></section>
        <div className="main-container pb-16">
            <div className="bg-[#F0F5FB] border-l-[3px] border-[#1a4494] p-5 mb-10 rounded-[4px]"><p className="text-[13.5px] text-slate-700 leading-relaxed"><strong className="text-[#150F3A]">Research Use Only:</strong> All compounds discussed are for in-vitro laboratory research only. <Link to="/pages/research-use-disclaimer" className="text-[#3390ec] hover:underline">Read our full disclaimer.</Link></p></div>
            <div className="mb-10"><h2 className="text-[18px] font-bold text-[#150F3A] mb-4 border-b border-slate-200 pb-2">Overview</h2><p className="text-[14px] text-slate-700 leading-[1.8]">Selank and Semax are both synthetic neuropeptides studied in laboratory settings, but they operate through different mechanisms. Selank is a tuftsin analogue studied for GABA-A receptor interactions and immune modulation, while Semax is an ACTH-derived peptide studied for BDNF expression and nootropic pathway research.</p></div>
            <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-[#E2E8F0] rounded-[8px] p-5 bg-white"><h3 className="text-[15px] font-bold text-[#214A9E] mb-3">Selank</h3><ul className="list-disc pl-4 space-y-2 text-[13.5px] text-slate-700"><li>Tuftsin analogue (Thr-Lys-Pro-Arg-Pro-Gly-Pro)</li>
                        <li>GABA-A receptor system research</li>
                        <li>Immunomodulatory pathway studies</li>
                        <li>Anxiety and stress model research</li></ul></div>
                <div className="border border-[#E2E8F0] rounded-[8px] p-5 bg-white"><h3 className="text-[15px] font-bold text-[#214A9E] mb-3">Semax</h3><ul className="list-disc pl-4 space-y-2 text-[13.5px] text-slate-700"><li>ACTH(4-7) Pro-Gly-Pro analogue</li>
                        <li>BDNF and neurotrophic factor expression</li>
                        <li>Neuroprotective pathway research</li>
                        <li>Cognitive and learning model studies</li></ul></div>
            </div>
            <div className="mb-10"><h2 className="text-[18px] font-bold text-[#150F3A] mb-4 border-b border-slate-200 pb-2">Related Resources</h2><div className="flex flex-wrap gap-3"><Link to="/products/selank-semax-20mg" className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] text-[#3390ec] hover:bg-slate-50 transition-colors">Selank & Semax Blend</Link>
                    <Link to="/pages/what-is-selank" className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] text-[#3390ec] hover:bg-slate-50 transition-colors">What Is Selank?</Link>
                    <Link to="/pages/what-is-semax" className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] text-[#3390ec] hover:bg-slate-50 transition-colors">What Is Semax?</Link>
                    <Link to="/pages/research-compound-database" className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] text-[#3390ec] hover:bg-slate-50 transition-colors">Compound Index</Link></div></div>
            <div className="bg-[#F0F5FB] border-l-[3px] border-[#1a4494] p-5 rounded-[4px] mb-8"><p className="text-[13.5px] text-slate-700 leading-relaxed"><strong className="text-[#150F3A]">Research Use Only:</strong> All products are manufactured for in-vitro laboratory research and are not intended for human consumption, medical use, or veterinary applications.</p></div>
        </div>
    </div>
);
export default Page;
