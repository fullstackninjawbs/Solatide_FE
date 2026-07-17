import React, { useState, useEffect } from 'react'
import { Eye, X, CheckCircle2, ShieldCheck, ZoomIn, ZoomOut } from 'lucide-react'

const CertificatesAnalysis = () => {
    const [activeTab, setActiveTab] = useState('All');
    const [selectedCoa, setSelectedCoa] = useState(null);
    const [coaData, setCoaData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [zoom, setZoom] = useState(1);

    useEffect(() => {
        const fetchCoas = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
                const res = await fetch(`${API_URL}/api/v1/coas`);
                const data = await res.json();
                console.log(data, "data---->");

                if (data.success) {
                    const mappedCoas = data.data.batches.map((batch, index) => ({
                        id: batch._id || index,
                        title: batch.productId?.name || batch.displayName || batch.batchId || 'Unknown Product',
                        purity: batch.purity || 'N/A',
                        endotoxin: batch.hasEndotoxinTest || batch.includesEndotoxin || batch.endotoxinIncludedInCoa ? '<1 EU/mg (Pass)' : '',
                        imageUrl: batch.coaFile?.url || batch.coaUrl || '',
                        status: batch.coaStatus === 'approved' ? 'Verified' : 'Pending'
                    }));
                    setCoaData(mappedCoas);
                }
            } catch (error) {
                console.error('Error fetching COAs:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCoas();
    }, []);

    if (loading) {
        return (
            <div className="w-full bg-white min-h-[60vh] flex items-center justify-center">
                <div className="text-slate-500 font-medium">Loading COA documents...</div>
            </div>
        );
    }

    const allCount = coaData.length;
    const verifiedCount = coaData.filter(coa => coa.status === 'Verified').length;
    const pendingCount = coaData.filter(coa => coa.status === 'Pending').length;

    const filteredCoas = coaData.filter(coa => activeTab === 'All' || coa.status === activeTab);

    return (
        <div className="w-full bg-white min-h-screen">
            <section className="w-full py-12 text-center">
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

            <section className="py-6 lg:py-8">
                <div className="main-container">

                    <div className="flex flex-wrap justify-center items-center gap-3 mb-10">
                        <button
                            onClick={() => setActiveTab('All')}
                            className={`px-5 py-2.5 rounded-full text-[13.5px] transition-all border shadow-sm flex items-center justify-center gap-1.5 ${activeTab === 'All' ? 'bg-[#1a4494] text-white border-[#1a4494]' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'}`}
                        >
                            All <span className={`text-[12px] ${activeTab === 'All' ? 'text-white' : 'text-slate-500'}`}>{allCount}</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('Verified')}
                            className={`px-5 py-2.5 rounded-full text-[13.5px] transition-all border shadow-sm flex items-center justify-center gap-1.5 ${activeTab === 'Verified' ? 'bg-[#1a4494] text-white border-[#1a4494]' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'}`}
                        >
                            Verified <span className={`text-[12px] ${activeTab === 'Verified' ? 'text-white' : 'text-slate-500'}`}>{verifiedCount}</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('Pending')}
                            className={`px-5 py-2.5 rounded-full text-[13.5px] transition-all border shadow-sm flex items-center justify-center gap-1.5 ${activeTab === 'Pending' ? 'bg-[#1a4494] text-white border-[#1a4494]' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'}`}
                        >
                            Pending <span className={`text-[12px] ${activeTab === 'Pending' ? 'text-white' : 'text-slate-500'}`}>{pendingCount}</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredCoas.length === 0 ? (
                            <div className="col-span-full py-12 text-center text-slate-500">
                                No Certificate of Analysis documents found.
                            </div>
                        ) : filteredCoas.map((coa) => (
                            <div key={coa.id} className="bg-white rounded-[14px] border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                                {/* Image Container */}
                                <div className="p-4 pb-0 relative">
                                    <div className="h-[150px] w-full bg-white border border-slate-200 rounded-[10px] overflow-hidden relative">
                                        {coa.imageUrl ? (
                                            <img
                                                src={coa.imageUrl}
                                                alt={`Certificate of Analysis for ${coa.title}`}
                                                className="w-full h-full object-cover object-top"
                                            />
                                        ) : (
                                            <>
                                                {/* Simulated Document */}
                                                <div className={`w-full h-full bg-white shadow-sm p-3 flex flex-col gap-2 ${coa.status === 'Pending' ? 'opacity-30 blur-[1px]' : 'opacity-80'}`}>
                                                    <div className="h-1.5 w-1/3 bg-[#ff9999] rounded"></div>
                                                    <div className="h-1 w-1/4 bg-slate-200 rounded"></div>
                                                    <div className="w-full h-px bg-slate-100 my-1"></div>
                                                    <div className="flex gap-2 mb-2">
                                                        <div className="h-6 w-full bg-[#f1f5f9] border border-slate-200 rounded-sm"></div>
                                                        <div className="h-6 w-full bg-[#f1f5f9] border border-slate-200 rounded-sm"></div>
                                                    </div>
                                                    <div className="h-12 w-full bg-[#f1f5f9] border border-slate-200 rounded-sm mt-auto"></div>
                                                </div>
                                            </>
                                        )}
                                        {/* Watermark */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-[0.06] transform -rotate-[25deg] pointer-events-none">
                                            <span className="text-4xl font-black tracking-widest text-slate-900">PUBLIC COPY</span>
                                        </div>
                                    </div>

                                    {/* Status Tag overlay */}
                                    <div className="absolute top-1.5 right-1.5 z-10">
                                        {coa.status === 'Verified' ? (
                                            <span className="bg-[#ebfbf3] text-[#1bb05e] border border-[#a6ebd4] px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide shadow-sm">
                                                {coa.purity}
                                            </span>
                                        ) : (
                                            <span className="bg-[#fff7ed] text-[#f97316] border border-[#ffedd5] px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide shadow-sm">
                                                Pending
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div className="p-5 flex flex-col flex-1">
                                    <div className="mb-4">
                                        <span className="text-[#01ACEE] font-extrabold text-[9px] uppercase tracking-[0.15em] mb-1.5 block">COA DOCUMENT</span>
                                        <h3 className="text-[#214A9E] text-[17px] font-bold leading-tight">{coa.title}</h3>
                                    </div>

                                    <div className="mt-auto mb-5 space-y-1.5">
                                        <p className="text-[13px] font-semibold text-slate-600">
                                            Purity: {coa.purity ? coa.purity : <span className="font-normal text-slate-400">TBD</span>}
                                        </p>
                                        {coa.endotoxin && (
                                            <p className="text-[12px] text-slate-500 font-medium">
                                                Endotoxin: {coa.endotoxin}
                                            </p>
                                        )}
                                    </div>

                                    {coa.status === 'Verified' ? (
                                        <button
                                            onClick={() => {
                                                setSelectedCoa(coa);
                                                setZoom(1);
                                            }}
                                            className="w-full text-center py-2.5 rounded-[8px] text-[13px] font-bold bg-gradient-to-r from-[#00ACEE] to-[#0079CD] text-white hover:bg-[#0165ab] shadow-sm"
                                        >
                                            View COA
                                        </button>
                                    ) : (
                                        <button className="w-full text-center py-2.5 rounded-[8px] text-[13px] font-bold transition-colors border border-slate-200 bg-[#f8fafc] text-slate-400 cursor-not-allowed">
                                            View COA
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </section>

            {selectedCoa && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6">
                    <div
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setSelectedCoa(null)}
                    ></div>

                    <div className="relative w-full max-w-[900px] max-h-[85vh] bg-white rounded-[20px] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 mt-4">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
                            <div className="flex items-center gap-3">
                                <span className="text-[12px] font-bold text-[#60A5FA] tracking-widest uppercase">
                                    COA
                                </span>
                                <h2 className="text-[22px] sm:text-[24px] font-medium text-[#214A9E] tracking-tight" style={{ fontFamily: 'Anek Telugu, sans-serif' }}>
                                    {selectedCoa.title}
                                </h2>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="hidden sm:flex items-center gap-1 bg-gray-100 rounded-lg p-1 mr-2">
                                    <button
                                        onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}
                                        className="p-1.5 text-gray-500 hover:bg-white hover:text-gray-900 rounded-md transition-all shadow-sm"
                                        title="Zoom Out"
                                    >
                                        <ZoomOut size={18} />
                                    </button>
                                    <span className="text-[13px] font-medium text-gray-600 min-w-[3ch] text-center">
                                        {Math.round(zoom * 100)}%
                                    </span>
                                    <button
                                        onClick={() => setZoom(z => Math.min(3, z + 0.25))}
                                        className="p-1.5 text-gray-500 hover:bg-white hover:text-gray-900 rounded-md transition-all shadow-sm"
                                        title="Zoom In"
                                    >
                                        <ZoomIn size={18} />
                                    </button>
                                </div>
                                <button
                                    onClick={() => setSelectedCoa(null)}
                                    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Document Scroll Area */}
                        <div className="flex-1 overflow-auto p-4 sm:p-8 bg-gray-50/50 flex justify-center items-start">
                            <div
                                className="transition-transform duration-200 origin-top flex justify-center"
                                style={{ transform: `scale(${zoom})` }}
                            >
                                <img
                                    src={selectedCoa.imageUrl}
                                    alt={`Certificate of Analysis for ${selectedCoa.title}`}
                                    className="max-w-full h-auto object-contain shadow-sm border border-gray-200 rounded-[8px] bg-white"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CertificatesAnalysis