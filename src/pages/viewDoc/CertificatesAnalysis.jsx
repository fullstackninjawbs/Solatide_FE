import React, { useState } from 'react'
import { Eye, X, CheckCircle2, ShieldCheck } from 'lucide-react'

const CertificatesAnalysis = () => {
    const [activeTab, setActiveTab] = useState('All');
    const [selectedCoa, setSelectedCoa] = useState(null);

    const coaData = [
        {
            id: 1,
            title: 'Retatrutide 5mg',
            purity: '99.94%',
            endotoxin: '<1 EU/mg (Pass)',
            imageUrl: 'https://solatidebiosciences.com.au/cdn/shop/files/Solatide_Public_COA_Retatrutide_5mg_SOL_RTA_26C_2605210107_1790b1cf-8acd-4785-acf3-01b06adfffb5.png?v=1781301675&width=900',
            status: 'All'
        },
        {
            id: 2,
            title: 'Retatrutide 5mg',
            purity: '99.94%',
            endotoxin: '<1 EU/mg (Pass)',
            imageUrl: 'https://solatidebiosciences.com.au/cdn/shop/files/Solatide_Public_COA_Retatrutide_5mg_SOL_RTA_26C_2605210107_1790b1cf-8acd-4785-acf3-01b06adfffb5.png?v=1781301675&width=900',
            status: 'All'
        },
        {
            id: 3,
            title: 'Retatrutide 5mg',
            purity: '99.94%',
            endotoxin: '<1 EU/mg (Pass)',
            imageUrl: 'https://solatidebiosciences.com.au/cdn/shop/files/Solatide_Public_COA_Retatrutide_5mg_SOL_RTA_26C_2605210107_1790b1cf-8acd-4785-acf3-01b06adfffb5.png?v=1781301675&width=900',
            status: 'All'
        },

        {
            id: 4,
            title: 'Semaglutide 5mg',
            purity: '99.9%',
            endotoxin: '<1 EU/mg (Pass)',
            imageUrl: 'https://solatidebiosciences.com.au/cdn/shop/files/semaglutide-5mg-freedom-diagnostics-certificate-of-analysis-coa_187eeac4-707d-4b88-8819-30ac968f7b50.jpg?v=1781301682&width=900',
            status: 'All'
        },
        {
            id: 5,
            title: 'Semaglutide 10mg',
            purity: '99.88%',
            endotoxin: '<1 EU/mg (Pass)',
            imageUrl: 'https://solatidebiosciences.com.au/cdn/shop/files/semaglutide-10mg-chromate-certificate-of-analysis-coa_ea84de7c-84f1-4549-b20e-1f6f3573c764.jpg?v=1781299572&width=900',
            status: 'All'
        },
        {
            id: 6,
            title: 'Cagrilintide 5mg',
            purity: '99.81%',
            endotoxin: '<1 EU/mg (Pass)',
            imageUrl: 'https://solatidebiosciences.com.au/cdn/shop/files/cagrilintide-5mg-chromate-certificate-of-analysis-coa_c1702f8f-8370-40d3-8eed-a377f83048ce_1.jpg?v=1781299575&width=900',
            status: 'All'
        }
    ];

    return (
        <div className="w-full bg-white min-h-screen">
            {/* Header Section */}
            <section className="w-full bg-[#F0F5FB] py-12 text-center">
                <div className="main-container">
                    <h1
                        className="text-[48px] font-semibold font-weight-600 md:text-[46px] text-[#214A9E] leading-tight mb-4"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                        Certificates of Analysis
                    </h1>
                    <p className="text-[16px] font-regular font-weight-400 text-[#6A6A6A] leading-[1.75] w-full mx-auto">
                        Access available third-party analytical documentation for selected Solatide Biosciences products and batches. Where available, documentation may include purity, identity, net content, endotoxin, or sterility information depending on the product and testing cycle.
                    </p>
                </div>
            </section>

            {/* Main Content Area */}
            <section className="py-12 lg:py-16">
                <div className="main-container">

                    {/* Filters */}
                    <div className="flex flex-wrap items-center gap-3 mb-10">
                        <button
                            onClick={() => setActiveTab('All')}
                            className={`px-5 py-2.5 rounded-full text-[13.5px] transition-all border shadow-sm flex items-center justify-center gap-1.5 ${activeTab === 'All' ? 'bg-[#1a4494] text-white border-[#1a4494]' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'}`}
                        >
                            All <span className={`text-[12px] ${activeTab === 'All' ? 'text-white' : 'text-slate-500'}`}>13</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('Verified')}
                            className={`px-5 py-2.5 rounded-full text-[13.5px] transition-all border shadow-sm flex items-center justify-center gap-1.5 ${activeTab === 'Verified' ? 'bg-[#1a4494] text-white border-[#1a4494]' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'}`}
                        >
                            Verified <span className={`text-[12px] ${activeTab === 'Verified' ? 'text-white' : 'text-slate-500'}`}>13</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('Pending')}
                            className={`px-5 py-2.5 rounded-full text-[13.5px] transition-all border shadow-sm flex items-center justify-center gap-1.5 ${activeTab === 'Pending' ? 'bg-[#1a4494] text-white border-[#1a4494]' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'}`}
                        >
                            Pending <span className={`text-[12px] ${activeTab === 'Pending' ? 'text-white' : 'text-slate-500'}`}>0</span>
                        </button>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {coaData.map((coa) => (
                            <div key={coa.id} className="group bg-white rounded-[20px] border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col hover:-translate-y-1.5 hover:shadow-[0_16px_32px_-8px_rgba(0,0,0,0.12)] hover:border-slate-200 transition-all duration-300 ease-out">

                                {/* Document Image Container */}
                                <div className="w-full relative flex items-center justify-center bg-slate-50/80 px-8 pt-10 pb-6 border-b border-slate-100/60 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent z-0"></div>
                                    <img
                                        src={coa.imageUrl}
                                        alt={coa.title}
                                        className="relative z-10 w-full h-auto object-contain object-center opacity-95 mix-blend-darken transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                                    />

                                    {/* Premium Purity Badge */}
                                    <div className="absolute top-5 right-5 bg-white/90 backdrop-blur-md border border-emerald-100/80 shadow-sm text-emerald-600 text-[11.5px] font-bold px-3.5 py-1.5 rounded-full z-20 tracking-wide flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse"></span>
                                        {coa.purity}
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div className="p-7 pt-6 flex flex-col flex-grow text-left">
                                    <div className="flex items-center mb-3">
                                        <span className="bg-blue-50 text-[#214A9E] text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-md">
                                            COA Document
                                        </span>
                                    </div>

                                    <h3 className="text-[22px] sm:text-[24px] font-semibold text-slate-900 mb-6 tracking-tight group-hover:text-[#214A9E] transition-colors duration-300" style={{ fontFamily: 'Anek Telugu, sans-serif' }}>
                                        {coa.title}
                                    </h3>
                                    
                                    <div className="flex flex-col gap-3.5 mb-8 min-h-[64px]">
                                        <div className="flex items-center gap-2.5 text-[14px] text-slate-600">
                                            <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                                            <span className="font-medium text-slate-700">Purity:</span> {coa.purity}
                                        </div>
                                        {coa.endotoxin && (
                                            <div className="flex items-center gap-2.5 text-[14px] text-slate-600">
                                                <ShieldCheck size={16} className="text-blue-500 shrink-0" />
                                                <span className="font-medium text-slate-700">Endotoxin:</span> {coa.endotoxin}
                                            </div>
                                        )}
                                    </div>

                                    {/* View COA Button */}
                                    <button 
                                        onClick={() => setSelectedCoa(coa)}
                                        className="w-full mt-auto bg-white border-2 border-slate-100 rounded-[12px] py-3 text-[14px] font-medium text-slate-700 flex items-center justify-center gap-2.5 group-hover:border-[#214A9E]/20 group-hover:bg-[#214A9E]/5 group-hover:text-[#214A9E] transition-all duration-300 ease-out"
                                    >
                                        <Eye size={18} className="text-slate-400 group-hover:text-[#214A9E] transition-colors duration-300" />
                                        <span>View COA</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </section>

            {/* COA Modal */}
            {selectedCoa && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setSelectedCoa(null)}
                    ></div>

                    {/* Modal Content */}
                    <div className="relative w-full max-w-[900px] max-h-[85vh] bg-white rounded-[20px] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 mt-4">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
                            <div className="flex items-center gap-3">
                                <span className="text-[12px] font-bold text-[#60A5FA] tracking-widest uppercase">
                                    COA
                                </span>
                                <h2 className="text-[22px] sm:text-[24px] font-medium text-[#214A9E] tracking-tight" style={{ fontFamily: 'Anek Telugu, sans-serif' }}>
                                    {selectedCoa.title}
                                </h2>
                            </div>
                            <button 
                                onClick={() => setSelectedCoa(null)}
                                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Document Scroll Area */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-gray-50/50 flex justify-center">
                            <img 
                                src={selectedCoa.imageUrl} 
                                alt={`Certificate of Analysis for ${selectedCoa.title}`} 
                                className="max-w-full h-auto object-contain shadow-sm border border-gray-200 rounded-[8px] bg-white"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CertificatesAnalysis