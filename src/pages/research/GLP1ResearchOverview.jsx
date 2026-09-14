import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
const sections = [
    { h: "What Is GLP-1?", body: "GLP-1 (glucagon-like peptide-1) is an incretin hormone produced in the gut in response to food intake. It plays a central role in regulating blood glucose levels, gastric emptying, and appetite signalling. In laboratory research, GLP-1 receptor agonists are studied for their effects on pancreatic beta-cell function, insulin secretion, glucagon suppression, and downstream metabolic pathway modulation." },
    { h: "GLP-1 Receptor Agonists in Research", body: "GLP-1 receptor agonists represent a broad class of research peptides that bind to and activate the GLP-1 receptor (GLP-1R). In laboratory models, they are studied for effects on cellular glucose uptake, insulin-related gene expression, beta-cell proliferation and protection, and interactions with other incretin receptors. Semaglutide is a well-characterised GLP-1 receptor agonist that has been studied extensively in metabolic research models, examining its binding affinity, half-life, and downstream signalling compared with native GLP-1." },
    { h: "GIP Receptor Co-Agonism", body: "Beyond single-receptor GLP-1 agonists, research has expanded into dual and triple agonist frameworks. Tirzepatide, a dual GLP-1/GIP receptor agonist, is studied in metabolic research for its combined receptor activation profile and potential additive or synergistic effects on metabolic signalling pathways. The addition of GIP receptor activation is the subject of comparative research examining how dual receptor engagement affects insulin sensitivity, lipid metabolism, and cellular energy balance in laboratory models." },
    { h: "Triple Receptor Agonism", body: "Retatrutide represents the next tier of receptor complexity, engaging GLP-1, GIP, and glucagon receptors simultaneously. In laboratory research, this triple agonist framework is studied for its combined receptor activation profile and the interaction between incretin and non-incretin receptor systems. Research examines how glucagon receptor co-activation affects hepatic glucose production, lipid oxidation, and energy expenditure in experimental metabolic models." },
    { h: "Amylin Receptor Pathways", body: "Cagrilintide is a long-acting amylin receptor agonist studied alongside GLP-1 agonists in combination metabolic research frameworks. CagriSema — the combination of cagrilintide and semaglutide — is studied for additive effects on satiety signalling, gastric emptying, and metabolic pathway modulation through complementary receptor systems." },
];
const GLP1ResearchOverview = () => (
    <div className="min-h-screen bg-white font-sans">
        <Helmet>
            <title>GLP-1 Research Overview | Metabolic Peptide Research | Solatide Biosciences</title>
            <meta name="description" content="Overview of GLP-1 receptor agonist research, including semaglutide, tirzepatide, retatrutide, and amylin receptor pathways. For in-vitro laboratory use only." />
            <link rel="canonical" href="https://solatidebiosciences.com.au/pages/glp-1-research-overview" />
        </Helmet>
        <section className="w-full py-4 text-center border-b border-slate-100 mb-10">
            <div className="main-container">
                <h1 className="text-[48px] md:text-[46px] font-bold text-center text-[#214A9E] leading-tight">GLP-1 Research Overview</h1>
            </div>
        </section>
        <div className="main-container pb-16">
            <div className="bg-[#F0F5FB] border-l-[3px] border-[#1a4494] p-5 mb-10 rounded-[4px]">
                <p className="text-[13.5px] text-slate-700 leading-relaxed"><strong className="text-[#150F3A]">Research Use Only:</strong> All compounds discussed are for in-vitro laboratory research only. Not for human consumption or medical use. <Link to="/pages/research-use-disclaimer" className="text-[#3390ec] hover:underline">Read our full disclaimer.</Link></p>
            </div>
            {sections.map((s) => (
                <div key={s.h} className="mb-10">
                    <h2 className="text-[18px] font-bold text-[#150F3A] mb-4 border-b border-slate-200 pb-2">{s.h}</h2>
                    <p className="text-[14px] text-slate-700 leading-[1.8]">{s.body}</p>
                </div>
            ))}
            <div className="mb-10">
                <h2 className="text-[18px] font-bold text-[#150F3A] mb-4 border-b border-slate-200 pb-2">GLP-1 Research Compounds at Solatide</h2>
                <div className="flex flex-wrap gap-3">
                    {[
                        { label: "Semaglutide 5mg", to: "/products/semaglutide-5mg" },
                        { label: "Tirzepatide 5mg", to: "/products/tirzepatide-5mg" },
                        { label: "Retatrutide 5mg", to: "/products/retatrutide-5mg" },
                        { label: "Cagrilintide 5mg", to: "/products/cagrilintide-5mg" },
                        { label: "CagriSema 10mg", to: "/products/cagrisema-10mg" },
                        { label: "GLP-1 Collection", to: "/collections/glp-1-metabolic-peptides" },
                    ].map((link) => (
                        <Link key={link.to} to={link.to} className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] text-[#3390ec] hover:bg-slate-50 transition-colors">{link.label}</Link>
                    ))}
                </div>
            </div>
            <div className="bg-[#F0F5FB] border-l-[3px] border-[#1a4494] p-5 rounded-[4px] mb-8">
                <p className="text-[13.5px] text-slate-700 leading-relaxed"><strong className="text-[#150F3A]">Research Use Only:</strong> All products are manufactured for in-vitro laboratory research and are not intended for human consumption, medical use, or veterinary applications.</p>
            </div>
        </div>
    </div>
);
export default GLP1ResearchOverview;
