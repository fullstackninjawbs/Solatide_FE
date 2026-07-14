import React from 'react'

const articles = [
    {
        id: 1,
        title: "Cagrilintide And Semaglutide: Analysing Dual-Receptor Synergies In Metabolic Research",
        date: "March 19, 2026",
        excerpt: "Research Use Only: This article discusses cagrilintide and semaglutide strictly in the context of laboratory research. All compounds referenced are intended for scientific investigation only and are not for human consumption, medical treatment, or veterinary use. Introduction The study of metabolic receptor signalling has expanded considerably as researchers have moved beyond single-receptor models toward combination frameworks that better reflect the complexity of integrated pathway regulation. Cagrilintide and semaglutide represent two distinct receptor-targeting compounds — one engaging the amylin receptor system, the other the Metabolic receptor — that have attracted growing...",
    },
    {
        id: 2,
        title: "NNMT Inhibition: The Role Of 5-Amino-1MQ In Cellular Energy And NAD-Related Pathways",
        date: "March 19, 2026",
        excerpt: "Research Use Only: This article discusses 5-Amino-1MQ and NNMT inhibition strictly in the context of laboratory research. All compounds referenced are intended for scientific investigation only and are not for human consumption, medical treatment, or veterinary use. Introduction Nicotinamide N-methyltransferase (NNMT) has emerged as a subject of increasing interest in metabolic pathway research, particularly in studies examining the intersection of one-carbon metabolism, NAD-related signalling, and cellular energy expenditure. 5-Amino-1MQ (5-Amino-1-methylquinolinium) is a small-molecule research compound that has been studied as a selective NNMT inhibitor in preclinical laboratory models. This article...",
    },
    {
        id: 3,
        title: "Metabolic Receptor Pathways In Metabolic Research",
        date: "March 19, 2026",
        excerpt: "An in-depth exploration of how triple agonist peptides are investigated in laboratory settings, covering receptor biology, experimental methodologies, and research applications.",
    },
    {
        id: 4,
        title: "How Triple Agonist Peptides Are Studied In Laboratory Research",
        date: "March 19, 2026",
        excerpt: "An in-depth exploration of how triple agonist peptides are investigated in laboratory settings, covering receptor biology, experimental methodologies, and research applications.",
    },
    {
        id: 5,
        title: "Retatrutide Vs Semaglutide: Research Comparison",
        date: "March 19, 2026",
        excerpt: "A comprehensive scientific comparison of retatrutide and semaglutide from a research perspective, examining receptor activation profiles, molecular structures, and laboratory applications.",
    }
];

const ResearchInsights = () => {
    return (
        <div className="w-full bg-white min-h-screen flex flex-col">
            <section className="w-full py-12 text-center">
                <div className="main-container">
                    <h1
                        className="text-[48px] font-semibold font-weight-600 md:text-[46px] text-[#214A9E] leading-tight mb-4 text-center"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                        Research Insights
                    </h1>
                    <p className="text-[16px] font-regular font-weight-400 text-[#6A6A6A] leading-[1.75] w-full text-center">
                        Stay informed with the latest findings, trends, and developments in peptide and compound research. Explore expert-driven insights designed to support deeper understanding and ongoing scientific exploration.
                    </p>
                </div>
            </section>

            <section className="w-full py-12 flex-grow">
                <div className="main-container">
                    <h2
                        className="text-[24px] font-weight-600 font-semibold text-[#214A9E] mb-8"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                        Getting Started
                    </h2>

                    <div className="flex flex-col gap-6">
                        {articles.map((article) => (
                            <div key={article.id} className="border border-[#E2E8F0] rounded-[12px] p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                                <h3 className="text-[14px] font-weight-500 font-medium text-[#214A9E] mb-2 cursor-pointer hover:underline">
                                    {article.title}
                                </h3>
                                <p className="text-[14px] font-weight-400 font-regular text-[#1E1E1E] mb-3">
                                    {article.date}
                                </p>
                                <p className="text-[14px] font-weight-400 font-regular text-[#6A6A6A] leading-[1.6] mb-2">
                                    {article.excerpt}
                                </p>
                                <span className="text-[14px] font-weight-500 font-medium text-[#1E1E1E] cursor-pointer hover:underline">
                                    Read more...
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="w-full bg-[#F8FAFC] border-t border-[#E2E8F0] py-8">
                <div className="main-container text-center">
                    <p className="text-[14px] text-[#6A6A6A]">
                        <span className="font-weight-500 font-medium text-[#1E1E1E]">Research Use Only:</span> All peptides are manufactured for laboratory research and are not intended for human consumption, medical use, or veterinary applications.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ResearchInsights