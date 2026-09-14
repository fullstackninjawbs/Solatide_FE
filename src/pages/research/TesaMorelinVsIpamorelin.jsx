import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
const Page = () => (
    <div className="min-h-screen bg-white font-sans">
        <Helmet>
            <title>Tesamorelin vs Ipamorelin | Solatide Biosciences</title>
            <meta name="description" content="Comparing Tesamorelin (GHRH analogue) and Ipamorelin (ghrelin mimetic) as growth hormone secretagogues in research. Different receptor mechanisms and profiles." />
            <link rel="canonical" href="https://solatidebiosciences.com.au/pages/tesamorelin-vs-ipamorelin" />
        </Helmet>
        <section className="w-full py-4 text-center border-b border-slate-100 mb-10"><div className="main-container"><h1 className="text-[48px] md:text-[46px] font-bold text-center text-[#214A9E] leading-tight">Tesamorelin vs Ipamorelin</h1></div></section>
        <div className="main-container pb-16">
            <div className="bg-[#F0F5FB] border-l-[3px] border-[#1a4494] p-5 mb-10 rounded-[4px]"><p className="text-[13.5px] text-slate-700 leading-relaxed"><strong className="text-[#150F3A]">Research Use Only:</strong> All compounds discussed are for in-vitro laboratory research only. <Link to="/pages/research-use-disclaimer" className="text-[#3390ec] hover:underline">Read our full disclaimer.</Link></p></div>
            <div className="mb-10"><h2 className="text-[18px] font-bold text-[#150F3A] mb-4 border-b border-slate-200 pb-2">Overview</h2><p className="text-[14px] text-slate-700 leading-[1.8]">Tesamorelin and Ipamorelin both stimulate growth hormone release in experimental models but through entirely different receptor mechanisms. Tesamorelin acts on GHRH receptors (similar to native GHRH), while Ipamorelin activates GHSR (ghrelin receptor). Research examines these two distinct GH-release pathways and their respective downstream effects.</p></div>
            <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-[#E2E8F0] rounded-[8px] p-5 bg-white"><h3 className="text-[15px] font-bold text-[#214A9E] mb-3">Tesamorelin</h3><ul className="list-disc pl-4 space-y-2 text-[13.5px] text-slate-700"><li>GHRH receptor (GHRHR) agonist</li>
                        <li>Stabilised GHRH analogue</li>
                        <li>GHRH pituitary pathway research</li>
                        <li>Visceral adiposity and metabolic model studies</li></ul></div>
                <div className="border border-[#E2E8F0] rounded-[8px] p-5 bg-white"><h3 className="text-[15px] font-bold text-[#214A9E] mb-3">Ipamorelin</h3><ul className="list-disc pl-4 space-y-2 text-[13.5px] text-slate-700"><li>GHSR (ghrelin receptor) agonist</li>
                        <li>Selective GH pulse without cortisol</li>
                        <li>5-amino acid pentapeptide</li>
                        <li>Studied alongside GHRH analogues for combined GH research</li></ul></div>
            </div>
            <div className="mb-10"><h2 className="text-[18px] font-bold text-[#150F3A] mb-4 border-b border-slate-200 pb-2">Related Resources</h2><div className="flex flex-wrap gap-3"><Link to="/products/tesamorelin-10mg" className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] text-[#3390ec] hover:bg-slate-50 transition-colors">Tesamorelin 10mg</Link>
                    <Link to="/products/cjc-1295-no-dac-ipamorelin-10mg" className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] text-[#3390ec] hover:bg-slate-50 transition-colors">CJC-1295/Ipamorelin Blend</Link>
                    <Link to="/pages/cjc-1295-vs-ipamorelin" className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] text-[#3390ec] hover:bg-slate-50 transition-colors">CJC-1295 vs Ipamorelin</Link>
                    <Link to="/pages/research-compound-database" className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] text-[#3390ec] hover:bg-slate-50 transition-colors">Compound Index</Link></div></div>
            <div className="bg-[#F0F5FB] border-l-[3px] border-[#1a4494] p-5 rounded-[4px] mb-8"><p className="text-[13.5px] text-slate-700 leading-relaxed"><strong className="text-[#150F3A]">Research Use Only:</strong> All products are manufactured for in-vitro laboratory research and are not intended for human consumption, medical use, or veterinary applications.</p></div>
        </div>
    </div>
);
export default Page;
