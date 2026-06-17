import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, ShieldAlert, Award, Database, FlaskConical, Thermometer, Info } from 'lucide-react'

const sections = [
    { id: 'sec1', num: '01', title: 'What are Research Peptides' },
    { id: 'sec2', num: '02', title: 'Compound Categories' },
    { id: 'sec3', num: '03', title: 'Applictions in Laboratory' },
    { id: 'sec4', num: '04', title: 'Storage Conditions' },
    { id: 'sec5', num: '05', title: 'Research Peptide Category' },
    { id: 'sec6', num: '06', title: 'Experimental Considerations' },
    { id: 'sec7', num: '08', title: 'Regulatory & Consideration' },
    { id: 'sec8', num: '09', title: 'Quality & Control' },
    { id: 'sec9', num: '10', title: 'Specific Peptide' },
    { id: 'sec10', num: '11', title: 'Resources' }
];

const ResearchResource = () => {
    const [activeSection, setActiveSection] = useState('sec1');

    // Handle scroll spy to highlight sidebar items
    useEffect(() => {
        const handleScroll = () => {
            // At the very top, always activate the first section
            if (window.scrollY < 100) {
                setActiveSection('sec1');
                return;
            }

            // At the bottom of the page, always activate the last section
            if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60) {
                setActiveSection(sections[sections.length - 1].id);
                return;
            }

            for (const section of sections) {
                const el = document.getElementById(section.id);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    // If the section is scrolled past the top offset (e.g. 220px to account for header)
                    // and its bottom hasn't scrolled past it yet, mark it active.
                    if (rect.top <= 220 && rect.bottom >= 220) {
                        setActiveSection(section.id);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check on mount
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToId = (id) => {
        const el = document.getElementById(id);
        if (el) {
            window.scrollTo({
                top: el.offsetTop - 120,
                behavior: 'smooth'
            });
            setActiveSection(id);
        }
    };

    return (
        <div className="w-full bg-[#f8fafc] min-h-screen pb-20">
            {/* Header Banner */}
            <section className="w-full bg-[#F0F5FB] py-16 text-center border-b border-slate-100">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                    <h1
                        className="text-4xl sm:text-5xl font-semibold text-[#214A9E] leading-tight mb-4"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                        Research Resource
                    </h1>
                    <p className="text-[15px] sm:text-[16px] font-regular text-[#6A6A6A] leading-[1.75] w-full">
                        A comprehensive reference for laboratory researchers — covering peptide fundamentals, compound categories, synthesis standards, storage protocols, and safety guidelines for in-vitro research use.
                    </p>
                </div>
            </section>

            {/* Layout Wrapper */}
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    
                    {/* Left Sticky Sidebar navigation */}
                    <aside className="w-full lg:w-[320px] bg-white rounded-3xl p-6 border border-[#E8E8E8] shadow-sm shrink-0 sticky top-[90px] text-left">
                        <h3 className="text-[17px] font-semibold text-[#1E1E1E] mb-4 px-2">On this page</h3>
                        <nav className="space-y-1">
                            {sections.map((sec) => (
                                <button
                                    key={sec.id}
                                    onClick={() => scrollToId(sec.id)}
                                    className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-[14.5px] transition-all ${
                                        activeSection === sec.id
                                            ? 'bg-[#F0F5FB] text-[#214A9E] font-semibold'
                                            : 'text-slate-600 hover:text-black hover:bg-slate-50 font-medium'
                                    }`}
                                >
                                    <span className={`text-[14px] shrink-0 w-5 ${activeSection === sec.id ? 'text-[#214A9E] font-bold' : 'text-[#94A3B8]'}`}>
                                        {sec.num}
                                    </span>
                                    <span className="flex-1 text-left whitespace-nowrap">{sec.title}</span>
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* Right Content Area */}
                    <div className="flex-grow w-full space-y-12 text-left">
                        
                        {/* Global Disclaimer Banner */}
                        <div className="bg-[#fef3c7]/40 border-l-4 border-amber-500 rounded-r-2xl p-6 text-[14.5px] leading-relaxed text-amber-900">
                            <span className="font-bold text-amber-950">Disclaimer:</span> All peptides and compounds discussed on this page are intended strictly for laboratory research purposes only. These materials are not intended for human consumption, medical treatment, veterinary use, or any therapeutic application.
                        </div>

                        {/* Section 01: What are Research Peptides */}
                        <section id="sec1" className="scroll-mt-24 py-4">
                            <span className="text-[#00E5FF] text-[15px] font-medium mb-2 block">
                                Research Resource
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-semibold text-[#214A9E] mb-6">
                                What Are Research Peptides ?
                            </h2>
                            <div className="space-y-4 text-[#6A6A6A] text-[15px] leading-[1.7]">
                                <p>
                                    Research peptides are short chains of amino acids that serve as fundamental tools in biochemical and pharmaceutical research. These synthetic or naturally-derived compounds enable scientists to investigate cellular mechanisms, receptor interactions, and metabolic pathways in controlled laboratory environments.
                                </p>
                                <p>
                                    Peptides typically consist of 2–50 amino acids linked by peptide bonds, distinguishing them from larger proteins. Their relatively small size and specific biological activity make them valuable for studying targeted biochemical processes without the complexity of full protein structures.
                                </p>
                                <p>
                                    Unlike large proteins, peptides offer researchers precise control over molecular interactions. Each compound is designed to probe a specific receptor, pathway, or biological mechanism — making them indispensable tools in modern laboratory science.
                                </p>
                            </div>

                            {/* Stat/Highlights Cards Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-center">
                                    <span className="text-2xl font-bold text-[#214A9E] block mb-1">2-50 AA</span>
                                    <span className="text-[12px] font-medium text-slate-800 block mb-0.5">Amino Acid Length</span>
                                    <span className="text-[10px] text-[#6A6A6A] leading-tight block">Distinguishes peptides from full proteins</span>
                                </div>
                                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-center">
                                    <span className="text-2xl font-bold text-[#214A9E] block mb-1">≥99%</span>
                                    <span className="text-[12px] font-medium text-slate-800 block mb-0.5">Purity Standard</span>
                                    <span className="text-[10px] text-[#6A6A6A] leading-tight block">Verified by third-party RP-HPLC testing</span>
                                </div>
                                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-center">
                                    <span className="text-2xl font-bold text-[#214A9E] block mb-1">-20°C</span>
                                    <span className="text-[12px] font-medium text-slate-800 block mb-0.5">Storage Temperature</span>
                                    <span className="text-[10px] text-[#6A6A6A] leading-tight block">Long-term lyophilised storage requirement</span>
                                </div>
                                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-center">
                                    <span className="text-2xl font-bold text-[#214A9E] block mb-1">-20°C</span>
                                    <span className="text-[12px] font-medium text-slate-800 block mb-0.5">Research Use Only</span>
                                    <span className="text-[10px] text-[#6A6A6A] leading-tight block">In-vitro laboratory applications exclusively</span>
                                </div>
                            </div>
                        </section>

                        {/* Section 02: Types Of Research Peptides / Compound Categories */}
                        <section id="sec2" className="scroll-mt-24 py-4">
                            <span className="text-[#00E5FF] text-[15px] font-medium mb-2 block">
                                Types Of Research Peptides
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-semibold text-[#214A9E] mb-4">
                                Compound Categories
                            </h2>
                            <p className="text-[#6A6A6A] text-[15px] leading-[1.7] mb-8">
                                Research peptides are classified by their mechanism of action and biological target. Understanding these categories helps researchers select the appropriate compound for their specific laboratory investigation.
                            </p>

                            {/* Cards Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Card 1 */}
                                <div className="border border-[#E8E8E8] rounded-2xl p-6 bg-white shadow-sm flex flex-col justify-between min-h-[220px]">
                                    <div>
                                        <h4 className="text-base font-bold text-[#1E1E1E] mb-3">Metabolic Research Peptides</h4>
                                        <p className="text-[13.5px] text-[#6A6A6A] leading-relaxed mb-4">
                                            Metabolic research peptides are used to investigate energy regulation, glucose metabolism, and lipid processing in laboratory models. These compounds help researchers understand fundamental metabolic pathways and receptor signalling mechanisms.
                                        </p>
                                    </div>
                                    <Link to="/product/2" className="text-[#00E5FF] text-[13.5px] font-medium hover:underline">
                                        What Is Retatrutide?
                                    </Link>
                                </div>

                                {/* Card 2 */}
                                <div className="border border-[#E8E8E8] rounded-2xl p-6 bg-white shadow-sm flex flex-col justify-between min-h-[220px]">
                                    <div>
                                        <h4 className="text-base font-bold text-[#1E1E1E] mb-3">Repair & Recovery Peptides</h4>
                                        <p className="text-[13.5px] text-[#6A6A6A] leading-relaxed mb-4">
                                            Repair and recovery peptides are increasingly studied for their potential roles in supporting cellular repair mechanisms, modulating tissue response pathways, and influencing recovery-related signaling processes in controlled laboratory models.
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[13.5px] text-slate-300">
                                        <Link to="/product/5" className="text-[#00E5FF] font-medium hover:underline">
                                            What Is BPC-157?
                                        </Link>
                                        <span>|</span>
                                        <Link to="/shop" className="text-[#00E5FF] font-medium hover:underline">
                                            What Is TB-500?
                                        </Link>
                                    </div>
                                </div>

                                {/* Card 3 */}
                                <div className="border border-[#E8E8E8] rounded-2xl p-6 bg-white shadow-sm flex flex-col justify-between min-h-[220px]">
                                    <div>
                                        <h4 className="text-base font-bold text-[#1E1E1E] mb-3">Dermal & Copper Peptides</h4>
                                        <p className="text-[13.5px] text-[#6A6A6A] leading-relaxed mb-4">
                                            Dermal peptides, including copper peptide complexes, are actively investigated in skin biology research for their potential roles in regulating cellular activity, supporting matrix remodeling, and influencing structural protein dynamics within the skin.
                                        </p>
                                    </div>
                                    <Link to="/shop" className="text-[#00E5FF] text-[13.5px] font-medium hover:underline">
                                        What Is GHK-Cu?
                                    </Link>
                                </div>

                                {/* Card 4 */}
                                <div className="border border-[#E8E8E8] rounded-2xl p-6 bg-white shadow-sm flex flex-col justify-between min-h-[220px]">
                                    <div>
                                        <h4 className="text-base font-bold text-[#1E1E1E] mb-3">Growth Factor Peptides</h4>
                                        <p className="text-[13.5px] text-[#6A6A6A] leading-relaxed mb-4">
                                            Growth factor peptides are employed in cellular research to study cell proliferation, differentiation, and tissue development. Laboratory investigations using these peptides contribute to understanding cellular growth mechanisms and regenerative processes.
                                        </p>
                                    </div>
                                </div>

                                {/* Card 5 */}
                                <div className="border border-[#E8E8E8] rounded-2xl p-6 bg-white shadow-sm flex flex-col justify-between min-h-[220px]">
                                    <div>
                                        <h4 className="text-base font-bold text-[#1E1E1E] mb-3">Receptor Agonist Peptides</h4>
                                        <p className="text-[13.5px] text-[#6A6A6A] leading-relaxed mb-4">
                                            Receptor agonist peptides bind to and activate specific cellular receptors, making them valuable tools for investigating receptor function, intracellular signaling cascades, and downstream cellular responses in controlled experimental settings.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section 03: Applications in Laboratory */}
                        <section id="sec3" className="scroll-mt-24 py-4">
                            <span className="text-[#00E5FF] text-[15px] font-medium mb-2 block">
                                Applications
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-semibold text-[#214A9E] mb-4">
                                Applications In Laboratory Research
                            </h2>
                            <p className="text-[#6A6A6A] text-[15px] leading-[1.7] mb-8">
                                Research peptides enable scientists to map and understand complex biochemical pathways. By introducing specific peptides into laboratory models, researchers can observe how cellular systems respond, identify key regulatory points, and elucidate mechanisms of action.
                            </p>
                            <div className="space-y-4">
                                {/* Item 01 */}
                                <div className="border border-[#E8E8E8] rounded-2xl p-6 bg-white shadow-sm flex items-start gap-4">
                                    <div className="h-9 w-9 rounded-full bg-[#1E1E1E] text-white flex items-center justify-center shrink-0 font-semibold text-[13px]">
                                        01
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-[#1E1E1E] mb-1">Biochemical Pathway Studies</h4>
                                        <p className="text-[13.5px] text-[#6A6A6A] leading-relaxed">
                                            Research peptides enable scientists to map and understand complex biochemical pathways. By introducing specific peptides into laboratory models, researchers can observe how cellular systems respond, identify key regulatory points, and elucidate mechanism of action.
                                        </p>
                                    </div>
                                </div>

                                {/* Item 02 */}
                                <div className="border border-[#E8E8E8] rounded-2xl p-6 bg-white shadow-sm flex items-start gap-4">
                                    <div className="h-9 w-9 rounded-full bg-[#1E1E1E] text-white flex items-center justify-center shrink-0 font-semibold text-[13px]">
                                        02
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-[#1E1E1E] mb-1">Receptor Binding Studies</h4>
                                        <p className="text-[13.5px] text-[#6A6A6A] leading-relaxed">
                                            Peptides are frequently used in receptor binding assays to determine affinity, selectivity, and functional outcomes of receptor activation. These studies are fundamental to understanding how cells communicate and respond to external signals.
                                        </p>
                                    </div>
                                </div>

                                {/* Item 03 */}
                                <div className="border border-[#E8E8E8] rounded-2xl p-6 bg-white shadow-sm flex items-start gap-4">
                                    <div className="h-9 w-9 rounded-full bg-[#1E1E1E] text-white flex items-center justify-center shrink-0 font-semibold text-[13px]">
                                        03
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-[#1E1E1E] mb-1">Metabolic Research</h4>
                                        <p className="text-[13.5px] text-[#6A6A6A] leading-relaxed">
                                            Laboratory investigations into metabolic regulation often employ peptides that interact with metabolic pathways. Researchers use these compounds to study glucose homeostasis, energy expenditure, and nutrient processing in experimental models.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section 04: Storage Conditions */}
                        <section id="sec4" className="scroll-mt-24 py-4">
                            <span className="text-[#00E5FF] text-[15px] font-medium mb-2 block">
                                Storage Conditions
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-semibold text-[#214A9E] mb-4">
                                Storage And Handling Protocols
                            </h2>
                            <p className="text-[#6A6A6A] text-[15px] leading-[1.7] mb-6">
                                Proper storage is critical for maintaining peptide stability and integrity. Most research peptides should be stored at -20°C or -80°C in lyophilised form. Reconstituted solutions have shorter stability windows.
                            </p>
                            <div className="space-y-4">
                                <div className="border border-[#E8E8E8] rounded-2xl p-6 bg-white shadow-sm">
                                    <h4 className="text-base font-bold text-[#1E1E1E] mb-2">Storage Conditions</h4>
                                    <p className="text-[13.5px] text-[#6A6A6A] leading-relaxed">
                                        Proper storage is critical for maintaining peptide stability and integrity. Lyophilised research peptides should be stored according to institutional laboratory protocols and manufacturer specifications. Researchers should consult their laboratory's standard operating procedures for peptide storage and handling.
                                    </p>
                                </div>
                                <div className="border border-[#E8E8E8] rounded-2xl p-6 bg-white shadow-sm">
                                    <h4 className="text-base font-bold text-[#1E1E1E] mb-2">Handling Precautions</h4>
                                    <p className="text-[13.5px] text-[#6A6A6A] leading-relaxed">
                                        Laboratory personnel should follow standard safety protocols when handling research peptides, including use of appropriate personal protective equipment (PPE), working in designated laboratory spaces, and following institutional biosafety guidelines.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Section 05: Common Research Peptide Categories */}
                        <section id="sec5" className="scroll-mt-24 py-4">
                            <span className="text-[#00E5FF] text-[15px] font-medium mb-2 block">
                                Types Of Research Peptides
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-semibold text-[#214A9E] mb-4">
                                Common Research Peptide Categories
                            </h2>
                            <p className="text-[#6A6A6A] text-[15px] leading-[1.7] mb-8">
                                Research peptides are classified by their mechanism of action and biological target. Understanding these categories helps researchers select the appropriate compound for their specific laboratory investigation.
                            </p>

                            {/* Cards Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Card 1 */}
                                <div className="border border-[#E8E8E8] rounded-2xl p-6 bg-white shadow-sm flex flex-col justify-between min-h-[220px]">
                                    <div>
                                        <h4 className="text-base font-bold text-[#1E1E1E] mb-3">Metabolic Receptor Agonists</h4>
                                        <p className="text-[13.5px] text-[#6A6A6A] leading-relaxed mb-4">
                                            Metabolic research peptides are used to investigate energy regulation, glucose metabolism, and lipid processing in laboratory models. These compounds help researchers understand fundamental metabolic pathways and receptor signalling mechanisms.
                                        </p>
                                    </div>
                                    <Link to="/shop" className="text-[#00E5FF] text-[13.5px] font-medium hover:underline">
                                        View Compounds →
                                    </Link>
                                </div>

                                {/* Card 2 */}
                                <div className="border border-[#E8E8E8] rounded-2xl p-6 bg-white shadow-sm flex flex-col justify-between min-h-[220px]">
                                    <div>
                                        <h4 className="text-base font-bold text-[#1E1E1E] mb-3">Multi-Receptor Agonists</h4>
                                        <p className="text-[13.5px] text-[#6A6A6A] leading-relaxed mb-4">
                                            Repair and recovery peptides are increasingly studied for their potential roles in supporting cellular repair mechanisms, modulating tissue response pathways, and influencing recovery-related signaling processes in controlled laboratory models.
                                        </p>
                                    </div>
                                    <Link to="/product/2" className="text-[#00E5FF] text-[13.5px] font-medium hover:underline">
                                        What Is Retatrutide?
                                    </Link>
                                </div>

                                {/* Card 3 */}
                                <div className="border border-[#E8E8E8] rounded-2xl p-6 bg-white shadow-sm flex flex-col justify-between min-h-[220px]">
                                    <div>
                                        <h4 className="text-base font-bold text-[#1E1E1E] mb-3">Selective Peptide Modulators</h4>
                                        <p className="text-[13.5px] text-[#6A6A6A] leading-relaxed mb-4">
                                            Dermal peptides, including copper peptide complexes, are actively investigated in skin biology research for their potential roles in regulating cellular activity, supporting matrix remodeling, and influencing structural protein dynamics within the skin.
                                        </p>
                                    </div>
                                    <Link to="/shop" className="text-[#00E5FF] text-[13.5px] font-medium hover:underline">
                                        View Compounds →
                                    </Link>
                                </div>
                            </div>
                        </section>

                        {/* Section 06: Experimental Considerations */}
                        <section id="sec6" className="scroll-mt-24 py-4">
                            <span className="text-[#00E5FF] text-[15px] font-medium mb-2 block">
                                Experimental Considerations
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-semibold text-[#214A9E] mb-4">
                                Experimental Design
                            </h2>
                            <p className="text-[#6A6A6A] text-[15px] leading-[1.7] mb-8">
                                Structured framework outlining the methodology, variables, and controlled conditions used to evaluate outcomes in a laboratory setting.
                            </p>
                            <div className="space-y-4">
                                <div className="border border-[#E8E8E8] rounded-2xl p-6 bg-white shadow-sm">
                                    <h4 className="text-base font-bold text-[#1E1E1E] mb-2">Experimental Design</h4>
                                    <p className="text-[13.5px] text-[#6A6A6A] leading-relaxed">
                                        Rigorous experimental design is essential when working with research peptides. Appropriate controls, including vehicle-treated groups and positive controls, ensure that observed effects can be attributed to the peptide under investigation. Researchers should consult published literature and established protocols when designing peptide research studies.
                                    </p>
                                </div>
                                <div className="border border-[#E8E8E8] rounded-2xl p-6 bg-white shadow-sm">
                                    <h4 className="text-base font-bold text-[#1E1E1E] mb-2">Data Analysis And Interpretation</h4>
                                    <p className="text-[13.5px] text-[#6A6A6A] leading-relaxed">
                                        Results from peptide research should be analysed using appropriate statistical methods and interpreted within the context of existing scientific literature. Reproducibility and peer review are fundamental principles of peptide research.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Section 07: Regulatory & Considerations */}
                        <section id="sec7" className="scroll-mt-24 py-4">
                            <span className="text-[#00E5FF] text-[15px] font-medium mb-2 block">
                                Regulatory & Consideration
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-semibold text-[#214A9E] mb-4">
                                Regulatory And Compliance Considerations
                            </h2>
                            <p className="text-[#6A6A6A] text-[15px] leading-[1.7] mb-8">
                                Research peptides are classified by their mechanism of action and biological target. Understanding these categories helps researchers select the appropriate compound for their specific laboratory investigation.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {/* Card 1 */}
                                <div className="border border-[#E8E8E8] rounded-2xl p-6 bg-white shadow-sm flex flex-col min-h-[220px]">
                                    <h4 className="text-base font-bold text-[#1E1E1E] mb-3">Research Use Only</h4>
                                    <p className="text-[13.5px] text-[#6A6A6A] leading-relaxed">
                                        It is critical to emphasise that research peptides are manufactured and distributed exclusively for laboratory research purposes. These compounds are not approved for human consumption, medical treatment, or veterinary applications.
                                    </p>
                                </div>

                                {/* Card 2 */}
                                <div className="border border-[#E8E8E8] rounded-2xl p-6 bg-white shadow-sm flex flex-col min-h-[220px]">
                                    <h4 className="text-base font-bold text-[#1E1E1E] mb-3">Institutional Oversight</h4>
                                    <p className="text-[13.5px] text-[#6A6A6A] leading-relaxed">
                                        Research involving peptides, particularly in animal models, must be conducted under appropriate institutional oversight, including Institutional Animal Care and Use Committee (IACUC) approval or equivalent ethics review and done.
                                    </p>
                                </div>

                                {/* Card 3 */}
                                <div className="border border-[#E8E8E8] rounded-2xl p-6 bg-white shadow-sm flex flex-col min-h-[220px]">
                                    <h4 className="text-base font-bold text-[#1E1E1E] mb-3">Documentation And Traceability</h4>
                                    <p className="text-[13.5px] text-[#6A6A6A] leading-relaxed">
                                        Maintaining detailed records of peptide sourcing, storage, handling, and experimental use is essential for research integrity and regulatory compliance to be done by our researcher this thing need to be done by the researcher
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Section: Emerging Areas of Peptide Research */}
                        <section id="sec_emerging" className="scroll-mt-24 py-4">
                            <span className="text-[#00E5FF] text-[15px] font-medium mb-2 block">
                                Emerging Research
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-semibold text-[#214A9E] mb-4">
                                Emerging Areas Of Peptide Research
                            </h2>
                            <p className="text-[#6A6A6A] text-[15px] leading-[1.7] mb-8">
                                Emerging Areas Of Peptide Research: Exploring novel applications of peptides across cellular signaling, regenerative studies, and advanced molecular pathways in evolving scientific landscapes.
                            </p>
                            <div className="space-y-4">
                                <div className="border border-[#E8E8E8] rounded-2xl p-6 bg-white shadow-sm">
                                    <h4 className="text-base font-bold text-[#1E1E1E] mb-2">Multi-Agonist Peptides</h4>
                                    <p className="text-[13.5px] text-[#6A6A6A] leading-relaxed">
                                        Recent research has focused on peptides that simultaneously activate multiple receptor types, such as Metabolic/GIP/glucagon triple agonists. These compounds are being investigated for their potential to modulate complex metabolic processes through coordinated receptor activation. <Link to="/product/2" className="text-[#00E5FF] font-medium hover:underline">Explore retatrutide research.</Link>
                                    </p>
                                </div>
                                <div className="border border-[#E8E8E8] rounded-2xl p-6 bg-white shadow-sm">
                                    <h4 className="text-base font-bold text-[#1E1E1E] mb-2">Peptide Modifications</h4>
                                    <p className="text-[13.5px] text-[#6A6A6A] leading-relaxed">
                                        Chemical modifications, including PEGylation, acylation, and amino acid substitutions, are being explored to enhance peptide stability, receptor selectivity, and pharmacokinetic properties in research models.
                                    </p>
                                </div>
                                <div className="border border-[#E8E8E8] rounded-2xl p-6 bg-white shadow-sm">
                                    <h4 className="text-base font-bold text-[#1E1E1E] mb-2">Peptide-Based Tool Compounds</h4>
                                    <p className="text-[13.5px] text-[#6A6A6A] leading-relaxed">
                                        Researchers are developing peptides as molecular tools to probe specific biological questions, including fluorescently-labelled peptides for imaging studies and biotinylated peptides for receptor identification.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Section 08: Quality & Control */}
                        <section id="sec8" className="scroll-mt-24 py-4">
                            <span className="text-[#00E5FF] text-[15px] font-medium mb-2 block">
                                Quality & Control
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-semibold text-[#214A9E] mb-4">
                                Quality Assurance In Peptide Research
                            </h2>
                            <p className="text-[#6A6A6A] text-[15px] leading-[1.7] mb-8">
                                Quality Assurance in Peptide Research: Rigorous protocols and analytical methods employed to ensure consistency, purity, and reliability across all experimental studies.
                            </p>
                            <div className="space-y-4">
                                <div className="border border-[#E8E8E8] rounded-2xl p-6 bg-white shadow-sm">
                                    <h4 className="text-base font-bold text-[#1E1E1E] mb-2">Certificate Of Analysis (COA)</h4>
                                    <p className="text-[13.5px] text-[#6A6A6A] leading-relaxed">
                                        Reputable suppliers provide a Certificate of Analysis with each peptide batch, documenting purity, identity confirmation via mass spectrometry, and other quality parameters. Researchers should review COAs before using peptides in experiments. <Link to="/coa" className="text-[#00E5FF] font-medium hover:underline">Learn More About Our COA And Testing Process.</Link>
                                    </p>
                                </div>
                                <div className="border border-[#E8E8E8] rounded-2xl p-6 bg-white shadow-sm">
                                    <h4 className="text-base font-bold text-[#1E1E1E] mb-2">Batch-To-Batch Consistency</h4>
                                    <p className="text-[13.5px] text-[#6A6A6A] leading-relaxed">
                                        For reproducible research, peptide suppliers should demonstrate consistent quality across different production batches. This consistency is verified through analytical testing and quality control procedures.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Section 09: Specific Peptide */}
                        <section id="sec9" className="scroll-mt-24 py-4">
                            <span className="text-[#00E5FF] text-[15px] font-medium mb-2 block">
                                Specific Peptide
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-semibold text-[#214A9E] mb-4">
                                Explore Specific Peptides
                            </h2>
                            <p className="text-[#6A6A6A] text-[15px] leading-[1.7] mb-6">
                                Learn more about individual research peptides:
                            </p>
                            <div className="space-y-4">
                                {/* Card 1 */}
                                <div className="border border-[#E8E8E8] rounded-2xl p-6 bg-white shadow-sm flex flex-col gap-2">
                                    <h4 className="text-base font-bold text-[#1E1E1E]">Triple-Agonist</h4>
                                    <p className="text-[13.5px] text-[#6A6A6A] leading-relaxed">
                                        Metabolic, GIP & glucagon receptor agonist for multi-receptor metabolic pathway and integrated signalling research.
                                    </p>
                                    <Link to="/product/2" className="text-[#00E5FF] text-[13px] font-medium hover:underline w-fit">
                                        What Is Retatrutide?
                                    </Link>
                                </div>

                                {/* Card 2 */}
                                <div className="border border-[#E8E8E8] rounded-2xl p-6 bg-white shadow-sm flex flex-col gap-2">
                                    <h4 className="text-base font-bold text-[#1E1E1E]">Body Composition</h4>
                                    <p className="text-[13.5px] text-[#6A6A6A] leading-relaxed">
                                        Body Composition & Repair Peptides: Studied for their potential roles in tissue response, recovery signaling.
                                    </p>
                                    <Link to="/product/5" className="text-[#00E5FF] text-[13px] font-medium hover:underline w-fit">
                                        What Is BPC-157?
                                    </Link>
                                </div>

                                {/* Card 3 */}
                                <div className="border border-[#E8E8E8] rounded-2xl p-6 bg-white shadow-sm flex flex-col gap-2">
                                    <h4 className="text-base font-bold text-[#1E1E1E]">Thymosin Beta-4</h4>
                                    <p className="text-[13.5px] text-[#6A6A6A] leading-relaxed">
                                        Thymosin Beta-4 Fragment: Investigated for its role in cellular migration processes and cytoskeletal
                                    </p>
                                    <Link to="/shop" className="text-[#00E5FF] text-[13px] font-medium hover:underline w-fit">
                                        What Is TB-500?
                                    </Link>
                                </div>
                            </div>
                        </section>

                        {/* Section 10: Resources */}
                        <section id="sec10" className="scroll-mt-24 py-4">
                            <span className="text-[#00E5FF] text-[15px] font-medium mb-2 block">
                                Resources
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-semibold text-[#214A9E] mb-4">
                                Related Research Resources
                            </h2>
                            <p className="text-[#6A6A6A] text-[15px] leading-[1.7] mb-8">
                                Related Research Resources: Curated materials, references, and scientific insights supporting ongoing peptide research and experimental exploration.
                            </p>
                            <div className="space-y-4">
                                {/* Card 1 */}
                                <div className="border border-[#E8E8E8] rounded-2xl p-6 bg-white shadow-sm flex flex-col gap-2">
                                    <h4 className="text-base font-bold text-[#1E1E1E]">Research Compound Database</h4>
                                    <p className="text-[13.5px] text-[#6A6A6A] leading-relaxed">
                                        Explore a structured collection of research compounds, including detailed profiles, classifications, and relevant scientific insights to support informed study and analysis.
                                    </p>
                                    <Link to="/shop" className="text-[#00E5FF] text-[13.5px] font-medium hover:underline w-fit">
                                        Research Compound Database
                                    </Link>
                                </div>

                                {/* Card 2 */}
                                <div className="border border-[#E8E8E8] rounded-2xl p-6 bg-white shadow-sm flex flex-col gap-2">
                                    <h4 className="text-base font-bold text-[#1E1E1E]">Metabolic Research Overview</h4>
                                    <p className="text-[13.5px] text-[#6A6A6A] leading-relaxed">
                                        An overview of Metabolic receptor-related research, focusing on signaling pathways, metabolic processes, and their relevance in controlled laboratory studies.
                                    </p>
                                    <Link to="/product-category/metabolic" className="text-[#00E5FF] text-[13.5px] font-medium hover:underline w-fit">
                                        Metabolic Research Overview
                                    </Link>
                                </div>

                                {/* Card 3 */}
                                <div className="border border-[#E8E8E8] rounded-2xl p-6 bg-white shadow-sm flex flex-col gap-2">
                                    <h4 className="text-base font-bold text-[#1E1E1E]">Retatrutide Research Overview</h4>
                                    <p className="text-[13.5px] text-[#6A6A6A] leading-relaxed">
                                        Examining Retatrutide in research settings, with emphasis on multi-receptor activity and its role in studying complex metabolic signaling pathways.
                                    </p>
                                    <Link to="/product/2" className="text-[#00E5FF] text-[13.5px] font-medium hover:underline w-fit">
                                        Retatrutide Research Overview
                                    </Link>
                                </div>

                                {/* Card 4 */}
                                <div className="border border-[#E8E8E8] rounded-2xl p-6 bg-white shadow-sm flex flex-col gap-2">
                                    <h4 className="text-base font-bold text-[#1E1E1E]">Semaglutide Research Overview</h4>
                                    <p className="text-[13.5px] text-[#6A6A6A] leading-relaxed">
                                        Insights into Semaglutide research, exploring metabolic receptor interactions and their effects on metabolic and regulatory mechanisms in experimental models.
                                    </p>
                                    <Link to="/product/1" className="text-[#00E5FF] text-[13.5px] font-medium hover:underline w-fit">
                                        Semaglutide Research Overview
                                    </Link>
                                </div>

                                {/* Card 5 */}
                                <div className="border border-[#E8E8E8] rounded-2xl p-6 bg-white shadow-sm flex flex-col gap-2">
                                    <h4 className="text-base font-bold text-[#1E1E1E]">Tirzepatide Research Overview</h4>
                                    <p className="text-[13.5px] text-[#6A6A6A] leading-relaxed">
                                        Overview of Tirzepatide research, focusing on dual receptor activity and its application in studying integrated metabolic pathways.
                                    </p>
                                    <Link to="/product/4" className="text-[#00E5FF] text-[13.5px] font-medium hover:underline w-fit">
                                        Tirzepatide Research Overview
                                    </Link>
                                </div>

                                {/* Card 6 */}
                                <div className="border border-[#E8E8E8] rounded-2xl p-6 bg-white shadow-sm flex flex-col gap-2">
                                    <h4 className="text-base font-bold text-[#1E1E1E]">CagriSema Research Overview</h4>
                                    <p className="text-[13.5px] text-[#6A6A6A] leading-relaxed">
                                        Exploration of CagriSema in research, highlighting combined pathway interactions and its relevance in advanced metabolic studies.
                                    </p>
                                    <Link to="/product/3" className="text-[#00E5FF] text-[13.5px] font-medium hover:underline w-fit">
                                        CagriSema Research Overview
                                    </Link>
                                </div>

                                {/* Card 7 */}
                                <div className="border border-[#E8E8E8] rounded-2xl p-6 bg-white shadow-sm flex flex-col gap-2">
                                    <h4 className="text-base font-bold text-[#1E1E1E]">CagriSema Comparison Guide</h4>
                                    <p className="text-[13.5px] text-[#6A6A6A] leading-relaxed">
                                        Comparative analysis of CagriSema against related compounds, outlining differences in mechanisms, pathways, and research applications.
                                    </p>
                                    <Link to="/coa" className="text-[#00E5FF] text-[13.5px] font-medium hover:underline w-fit">
                                        CagriSema Comparison Guide
                                    </Link>
                                </div>

                                {/* Card 8 */}
                                <div className="border border-[#E8E8E8] rounded-2xl p-6 bg-white shadow-sm flex flex-col gap-2">
                                    <h4 className="text-base font-bold text-[#1E1E1E]">What is BPC-157?</h4>
                                    <p className="text-[13.5px] text-[#6A6A6A] leading-relaxed">
                                        An introduction to BPC-157, focusing on its study in cellular repair mechanisms, tissue response pathways, and experimental recovery models.
                                    </p>
                                    <Link to="/product/5" className="text-[#00E5FF] text-[13.5px] font-medium hover:underline w-fit">
                                        What is BPC-157?
                                    </Link>
                                </div>

                                {/* Card 9 */}
                                <div className="border border-[#E8E8E8] rounded-2xl p-6 bg-white shadow-sm flex flex-col gap-2">
                                    <h4 className="text-base font-bold text-[#1E1E1E]">What is TB-500?</h4>
                                    <p className="text-[13.5px] text-[#6A6A6A] leading-relaxed">
                                        Overview of TB-500, a peptide studied for its role in cellular migration, actin regulation, and tissue response processes in laboratory research.
                                    </p>
                                    <Link to="/shop" className="text-[#00E5FF] text-[13.5px] font-medium hover:underline w-fit">
                                        What is TB-500?
                                    </Link>
                                </div>

                                {/* Card 10 */}
                                <div className="border border-[#E8E8E8] rounded-2xl p-6 bg-white shadow-sm flex flex-col gap-2">
                                    <h4 className="text-base font-bold text-[#1E1E1E]">BPC-157 Vs TB-500 Comparison</h4>
                                    <p className="text-[13.5px] text-[#6A6A6A] leading-relaxed">
                                        Side-by-side comparison of BPC-157 and TB-500, examining their distinct mechanisms, research focus areas, and experimental applications.
                                    </p>
                                    <Link to="/coa" className="text-[#00E5FF] text-[13.5px] font-medium hover:underline w-fit">
                                        BPC-157 Vs TB-500 Comparison
                                    </Link>
                                </div>
                            </div>
                        </section>

                        {/* Footer Disclaimer Banner */}
                        <div className="bg-[#F0F5FB] border border-[#E8E8E8] rounded-2xl p-6 text-[14.5px] leading-relaxed text-[#6A6A6A]">
                            <span className="font-bold text-[#1E1E1E]">Research Use Only:</span> All peptides are manufactured for laboratory research and are not intended for human consumption, medical use, or veterinary applications.
                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}

export default ResearchResource
