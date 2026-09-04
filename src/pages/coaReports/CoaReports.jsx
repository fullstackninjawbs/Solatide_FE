import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../../services/api';

const CoaReports = () => {
    const [coaData, setCoaData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [selectedCoa, setSelectedCoa] = useState(null);

    useEffect(() => {
        const fetchCoas = async () => {
            try {
                const res = await apiService.getPublicCoas();
                const json = await res.json();
                if (json.success && json.data?.batches) {
                    const formattedData = json.data.batches.map(batch => {
                        const hasCoa = batch.coaFile?.url || batch.coaUrl;
                        const productName = batch.productId?.name || (batch.products && batch.products.length > 0 ? batch.products[0].name : '');
                        const amountStr = batch.amount ? ` ${batch.amount}${batch.unit || ''}` : '';
                        const titleName = productName ? `${productName}${amountStr}`.trim() : (batch.displayName || batch.batchId);
                        
                        return {
                            id: batch._id,
                            title: titleName,
                            batchNumber: batch.batchId,
                            purity: batch.tests?.purityHplc?.result,
                            endotoxin: batch.tests?.endotoxinUsp85?.result,
                            status: batch.coaStatus === 'approved' ? 'Verified' : 'Pending',
                            imageUrl: batch.coaFile?.url || batch.coaUrl
                        };
                    });
                    setCoaData(formattedData);
                }
            } catch (err) {
                console.error("Error fetching COAs", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCoas();
    }, []);

    useEffect(() => {
        if (selectedCoa) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedCoa]);

    const filteredData = coaData.filter(item => {
        if (filter === 'All') return true;
        return item.status === filter;
    });

    const counts = {
        All: coaData.length,
        Verified: coaData.filter(i => i.status === 'Verified').length,
        Pending: coaData.filter(i => i.status === 'Pending').length,
    };

    return (
        <div className="w-full bg-white min-h-screen">
            <section className="w-full py-4 text-center border-b border-slate-100">
                <div className="main-container">
                    <h1
                        className="text-[48px] font-semibold font-weight-600 md:text-[46px] text-[#214A9E] leading-tight mb-4"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                        Certificates of Analysis
                    </h1>
                    <p className="text-[16px] font-regular font-weight-400 text-[#6A6A6A] leading-[1.75] w-full mx-auto">
                        Find answers to commonly asked questions about our research compounds, ordering process, and general guidelines to support your understanding.                    </p>
                </div>
            </section>
            <div className="flex justify-center gap-3 mt-20 px-4">
                <button
                    onClick={() => setFilter('All')}
                    className={`px-6 py-2.5 rounded-full text-[13px] font-semibold transition-colors flex items-center gap-2 ${filter === 'All' ? 'bg-[#214A9E] text-white shadow-md' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'}`}
                >
                    All <span className={filter === 'All' ? 'bg-[#163678] text-white px-2 py-0.5 rounded-full text-[11px]' : 'bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-[11px]'}>{counts.All}</span>
                </button>
                <button
                    onClick={() => setFilter('Verified')}
                    className={`px-6 py-2.5 rounded-full text-[13px] font-semibold transition-colors flex items-center gap-2 ${filter === 'Verified' ? 'bg-[#214A9E] text-white shadow-md' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'}`}
                >
                    Verified <span className={filter === 'Verified' ? 'bg-[#163678] text-white px-2 py-0.5 rounded-full text-[11px]' : 'bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-[11px]'}>{counts.Verified}</span>
                </button>
                <button
                    onClick={() => setFilter('Pending')}
                    className={`px-6 py-2.5 rounded-full text-[13px] font-semibold transition-colors flex items-center gap-2 ${filter === 'Pending' ? 'bg-[#214A9E] text-white shadow-md' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'}`}
                >
                    Pending <span className={filter === 'Pending' ? 'bg-[#163678] text-white px-2 py-0.5 rounded-full text-[11px]' : 'bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-[11px]'}>{counts.Pending}</span>
                </button>
            </div>

            <div className="main-container">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#214A9E]"></div>
                    </div>
                ) : filteredData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center text-slate-500">
                        <p className="text-lg mb-2">No COA reports found matching your criteria.</p>
                        <button onClick={() => setFilter('All')} className="text-[#214A9E] hover:underline">View all reports</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredData.map(item => (
                            <div key={item.id} className="bg-white rounded-[14px] border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                            {/* Image Container */}
                            {/* Image Container */}
                            <div className="p-4 pb-0 relative">
                                <div className="h-[150px] w-full bg-white border border-slate-200 rounded-[10px] overflow-hidden relative">
                                    {item.imageUrl && item.status === 'Verified' ? (
                                        <img
                                            src={item.imageUrl}
                                            alt={`Certificate of Analysis for ${item.title}`}
                                            className="w-full h-full object-cover object-top"
                                        />
                                    ) : (
                                        <>
                                            {/* Simulated Document */}
                                            <div className={`w-full h-full bg-white shadow-sm p-3 flex flex-col gap-2 ${item.status === 'Pending' ? 'opacity-30 blur-[1px]' : 'opacity-80'}`}>
                                                <div className="h-1.5 w-1/3 bg-[#ff9999] rounded"></div>
                                                <div className="h-1 w-1/4 bg-slate-200 rounded"></div>
                                                <div className="w-full h-px bg-slate-100 my-1"></div>
                                                <div className="flex gap-2 mb-2">
                                                    <div className="h-6 w-full bg-[#f1f5f9] border border-slate-200 rounded-sm"></div>
                                                    <div className="h-6 w-full bg-[#f1f5f9] border border-slate-200 rounded-sm"></div>
                                                </div>
                                                <div className="h-12 w-full bg-[#f1f5f9] border border-slate-200 rounded-sm mt-auto"></div>
                                            </div>

                                            {/* Watermark */}
                                            <div className="absolute inset-0 flex items-center justify-center opacity-[0.06] transform -rotate-[25deg] pointer-events-none">
                                                <span className="text-4xl font-black tracking-widest text-slate-900">PUBLIC COPY</span>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Status Tag overlay */}
                                <div className="absolute top-1.5 right-1.5">
                                    {item.status === 'Verified' ? (
                                        <span className="bg-[#ebfbf3] text-[#1bb05e] border border-[#a6ebd4] px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide shadow-sm">
                                            {item.purity}
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
                                    <h3 className="text-[#214A9E] text-[17px] font-bold leading-tight">{item.title}</h3>
                                    <p className="text-slate-500 text-[12px] font-medium mt-1">Batch: {item.batchNumber}</p>
                                </div>

                                <div className="mt-auto mb-5 space-y-1.5">
                                    <p className="text-[13px] font-semibold text-slate-600">
                                        Purity: {item.purity ? item.purity : <span className="font-normal text-slate-400">TBD</span>}
                                    </p>
                                    {item.endotoxin && (
                                        <p className="text-[12px] text-slate-500 font-medium">
                                            Endotoxin: {item.endotoxin}
                                        </p>
                                    )}
                                </div>

                                {item.status === 'Verified' ? (
                                    <button
                                        onClick={() => setSelectedCoa(item)}
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
                )}
            </div>

            <div className="max-w-[750px] mx-auto px-4 mt-24 mb-16">
                <h3 className="text-[#214A9E] font-bold text-[17px] mb-3">Related Support Pages</h3>
                <div className="bg-[#f8fafd] border border-[#d9e5f3] p-5 rounded-[8px]">
                    <h4 className="text-[#214A9E] font-bold text-[13px] mb-4">Support pages</h4>
                    <div className="flex flex-wrap gap-2.5">
                        <Link to="/contact" className="bg-[#ebf2fc] text-[#214A9E] border border-[#d1e0f3] px-4 py-1.5 rounded-full text-[12px] hover:bg-[#e1ecfa] transition-colors">Contact Us</Link>
                        <Link to="/faq" className="bg-[#ebf2fc] text-[#214A9E] border border-[#d1e0f3] px-4 py-1.5 rounded-full text-[12px] hover:bg-[#e1ecfa] transition-colors">FAQ</Link>
                        <Link to="/peptides-guide" className="bg-[#ebf2fc] text-[#214A9E] border border-[#d1e0f3] px-4 py-1.5 rounded-full text-[12px] hover:bg-[#e1ecfa] transition-colors">Research Peptides Guide</Link>
                        <Link to="/compound-database" className="bg-[#ebf2fc] text-[#214A9E] border border-[#d1e0f3] px-4 py-1.5 rounded-full text-[12px] hover:bg-[#e1ecfa] transition-colors">Research Compound Database</Link>
                    </div>
                </div>
            </div>

            {selectedCoa && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-6 bg-slate-900/70 backdrop-blur-sm" onClick={() => setSelectedCoa(null)}>
                    <div
                        className="bg-white rounded-[14px] w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-5 md:px-7 border-b border-slate-100">
                            <h2 className="text-[#214A9E] font-bold text-[17px]">{selectedCoa.title}</h2>
                            <button
                                onClick={() => setSelectedCoa(null)}
                                className="text-slate-400 hover:text-[#214A9E] bg-slate-50 hover:bg-slate-100 rounded-full p-2 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#f4f7fb] flex justify-center">
                            {/* Detailed COA HTML Document */}
                            {selectedCoa.imageUrl ? (
                                <div className="w-full max-w-4xl flex flex-col mx-auto my-auto">
                                    <img
                                        src={selectedCoa.imageUrl}
                                        alt={`Certificate of Analysis for ${selectedCoa.title}`}
                                        className="w-full h-auto object-contain shadow-sm"
                                    />
                                </div>
                            ) : (
                                <div className="w-full max-w-3xl bg-white aspect-[1/1.2] border border-slate-200 shadow-sm p-6 md:p-10 flex flex-col relative mx-auto my-auto font-sans text-slate-800">
                                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] transform -rotate-[35deg] pointer-events-none z-0">
                                        <span className="text-5xl md:text-8xl font-black tracking-widest text-slate-900">PUBLIC COPY</span>
                                    </div>

                                    <div className="relative z-10 flex flex-col h-full">
                                        {/* Header */}
                                        <div className="flex justify-between items-start border-b border-slate-300 pb-4 mb-6">
                                            <div className="flex items-center gap-2">
                                                <div className="text-2xl font-black italic tracking-tighter text-slate-800 flex items-center gap-1">
                                                    <svg className="w-6 h-6 text-slate-800" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M12 2L2 22h20L12 2zm0 3.8l7.2 14.2H4.8L12 5.8z" />
                                                    </svg>
                                                    Chromate
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <h3 className="text-xl font-bold text-slate-800">Certificate of Analysis</h3>
                                                <p className="text-slate-400 text-sm">#24958-3920-2</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-end mb-6 text-xs font-semibold text-slate-600">
                                            <div>
                                                <div className="w-32 h-4 bg-slate-300 rounded mb-1"></div>
                                                <div className="w-48 h-4 bg-slate-300 rounded"></div>
                                            </div>
                                            <div className="text-right">
                                                <p>Sample received: 09/10/25</p>
                                                <p>Analysis conducted: 09/15/25</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs mb-6">
                                            <div className="flex border border-[#214A9E]/20">
                                                <div className="bg-[#214A9E] text-white w-24 px-2 py-1.5 font-bold flex items-center">Product:</div>
                                                <div className="px-2 py-1.5 bg-[#F0F5FB] flex-1 text-[#214A9E] font-semibold flex items-center">{selectedCoa.title}</div>
                                            </div>
                                            <div className="flex border border-[#214A9E]/20">
                                                <div className="bg-[#214A9E] text-white w-24 px-2 py-1.5 font-bold flex items-center">CAS:</div>
                                                <div className="px-2 py-1.5 bg-[#F0F5FB] flex-1 text-[#214A9E] font-semibold flex items-center">910463-68-2</div>
                                            </div>
                                            <div className="flex border border-[#214A9E]/20">
                                                <div className="bg-[#214A9E] text-white w-24 px-2 py-1.5 font-bold flex items-center">Batch:</div>
                                                <div className="px-2 py-1.5 bg-[#F0F5FB] flex-1 text-[#214A9E] font-semibold flex items-center">{selectedCoa.batchNumber}</div>
                                            </div>
                                            <div className="flex border border-[#214A9E]/20">
                                                <div className="bg-[#214A9E] text-white w-24 px-2 py-1.5 font-bold flex items-center">Formula:</div>
                                                <div className="px-2 py-1.5 bg-[#F0F5FB] flex-1 text-[#214A9E] font-semibold flex items-center">C187H291N45O59</div>
                                            </div>
                                            <div className="flex border border-[#214A9E]/20">
                                                <div className="bg-[#214A9E] text-white w-24 px-2 py-1.5 font-bold flex items-center">Appearance:</div>
                                                <div className="px-2 py-1.5 bg-[#F0F5FB] flex-1 text-[#214A9E] font-semibold flex items-center">Lyophilized peptide vial</div>
                                            </div>
                                            <div className="flex border border-[#214A9E]/20">
                                                <div className="bg-[#214A9E] text-white w-24 px-2 py-1.5 font-bold flex items-center">Mol Wt:</div>
                                                <div className="px-2 py-1.5 bg-[#F0F5FB] flex-1 text-[#214A9E] font-semibold flex items-center">4113.64 g mol-1</div>
                                            </div>
                                        </div>

                                        <p className="text-center text-[11px] font-semibold text-slate-700 mb-2">Qualitative and quantitative chemical analysis by RP-HPLC with UV detection</p>
                                        <table className="w-full text-xs text-center border-collapse mb-6">
                                            <thead>
                                                <tr>
                                                    <th className="w-1/4"></th>
                                                    <th className="border-2 border-white bg-red-100/50 text-red-500 py-1.5">Specification</th>
                                                    <th className="border-2 border-white bg-red-100/50 text-red-500 py-1.5">Result</th>
                                                    <th className="w-1/6"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="bg-[#214A9E] text-white font-bold py-1.5 border-2 border-white">Identity</td>
                                                    <td className="bg-[#eaf4ec] text-slate-700 py-1.5 border-2 border-white font-semibold">Semaglutide</td>
                                                    <td className="bg-[#eaf4ec] text-slate-700 py-1.5 border-2 border-white font-semibold">Semaglutide</td>
                                                    <td className="text-slate-500 py-1.5">Conforms</td>
                                                </tr>
                                                <tr>
                                                    <td className="bg-[#214A9E] text-white font-bold py-1.5 border-2 border-white">Quantity</td>
                                                    <td className="bg-[#eaf4ec] text-slate-700 py-1.5 border-2 border-white font-semibold">10mg</td>
                                                    <td className="bg-[#eaf4ec] text-slate-700 py-1.5 border-2 border-white font-semibold">11.14mg</td>
                                                    <td className="text-slate-500 py-1.5">+11.4%</td>
                                                </tr>
                                                <tr>
                                                    <td className="bg-[#214A9E] text-white font-bold py-1.5 border-2 border-white">Purity</td>
                                                    <td className="bg-[#eaf4ec] text-slate-700 py-1.5 border-2 border-white font-semibold">&gt; 99%</td>
                                                    <td className="bg-[#eaf4ec] text-slate-700 py-1.5 border-2 border-white font-semibold">{selectedCoa.purity}</td>
                                                    <td className="text-slate-500 py-1.5">Conforms</td>
                                                </tr>
                                            </tbody>
                                        </table>

                                        <div className="flex gap-4 mb-6">
                                            <div className="flex-1 border border-slate-200 h-32 relative bg-white flex items-end px-4 pb-2">
                                                <div className="w-full h-[1px] bg-slate-300 relative flex items-end">
                                                    <div className="absolute left-[15%] bottom-0 w-[1px] h-6 bg-[#214A9E]"></div>
                                                    <div className="absolute left-[22%] bottom-0 w-[1px] h-3 bg-[#214A9E]"></div>
                                                    <div className="absolute left-[40%] bottom-0 w-0.5 h-16 bg-[#214A9E]"></div>
                                                    <div className="absolute left-[42%] bottom-0 w-[1px] h-4 bg-[#214A9E]"></div>
                                                    <div className="absolute left-[65%] bottom-0 w-0.5 h-24 bg-[#214A9E]"></div>
                                                    <div className="absolute left-[80%] bottom-0 w-[1px] h-2 bg-[#214A9E]"></div>
                                                </div>
                                                <div className="absolute top-1 left-2 text-[7px] text-slate-400">DAD1 A, Sig=214,4 Ref=360,100 (C:\CHEM32\1\DATA\...)</div>
                                                <div className="absolute top-1 right-2 text-[7px] text-slate-400">chromatogram</div>
                                            </div>
                                            <div className="w-24 border border-slate-200 h-32 bg-slate-100 flex items-center justify-center relative">
                                                <div className="w-7 h-14 border border-slate-300 rounded-b-md relative shadow-sm" style={{ background: 'linear-gradient(to right, #f8fafc 0%, #ffffff 50%, #e2e8f0 100%)' }}>
                                                    <div className="absolute -top-1 w-full h-3 bg-red-600 rounded-t-sm shadow-sm border border-red-700"></div>
                                                    <div className="absolute bottom-1 w-full h-4 bg-white rounded-b-md opacity-90 border-t border-slate-200"></div>
                                                </div>
                                                <div className="absolute bottom-0 right-0 bg-[#01ACEE] text-white text-[7px] px-1 py-0.5 w-full text-right font-bold">sample pic</div>
                                            </div>
                                        </div>
                                        <div className="mt-auto flex justify-between items-end border-t-2 border-slate-200 pt-6 bg-[#f4fbfa] p-4 rounded-b-md">
                                            <div>
                                                <div className="text-3xl text-slate-800 mb-1 leading-none" style={{ fontFamily: 'cursive, "Brush Script MT", "Snell Roundhand"' }}>Lucas Weber</div>
                                                <div className="text-[10px] font-bold text-slate-800">Lucas Weber</div>
                                                <div className="text-[9px] text-slate-600">Principal Chemist</div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="text-right text-[8px] text-slate-700 font-medium">
                                                    <div>COA</div>
                                                    <div>ACCESS CODE: <span className="font-mono bg-white border border-slate-200 px-1 py-0.5 font-bold">chromate.org/verify</span></div>
                                                    <div>produced 09/25/25</div>
                                                </div>
                                                <div className="w-12 h-12 bg-white border border-slate-300 p-1 flex flex-wrap relative">
                                                    <div className="absolute top-1 left-1 w-3 h-3 bg-black"></div>
                                                    <div className="absolute top-1 right-1 w-3 h-3 bg-black"></div>
                                                    <div className="absolute bottom-1 left-1 w-3 h-3 bg-black"></div>
                                                    <div className="absolute top-2 left-2 w-1 h-1 bg-white"></div>
                                                    <div className="absolute top-2 right-2 w-1 h-1 bg-white"></div>
                                                    <div className="absolute bottom-2 left-2 w-1 h-1 bg-white"></div>
                                                    <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-black rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                                                    <div className="absolute bottom-1 right-1 w-2 h-2 bg-black"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoaReports;
