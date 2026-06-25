import React from 'react'
import { Send, MessageSquare } from 'lucide-react'

const NeverMissRestock = () => {
    const handleEmailSubmit = (e) => {
        e.preventDefault()
    }

    return (
        <section className="w-full bg-white py-12 lg:py-16 text-center">
            <div className="main-container max-w-[1440px]">

                <div className="mb-8">
                    <span className="text-[#00ADEE] text-[13px] font-semibold mb-2 block uppercase tracking-wider">
                        Stay updated with restocks and important product updates
                    </span>
                    <h2 className="text-[26px] sm:text-[36px] font-anek font-bold text-[#1D1D1F] leading-tight max-w-none mx-auto px-4">
                        Never Miss A
                        <span className="text-[#00ADEE] mb-2 tracking-wider">
                            &nbsp;Restock
                        </span>

                    </h2>
                </div>


                <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-3 max-w-[600px] mx-auto px-4">
                    <input
                        type="email"
                        placeholder="Enter Your E-Mail"
                        required
                        className="w-full sm:flex-1 h-[46px] rounded-[14px] px-5 bg-[#F5F8FC] border border-[#DEF5FF] text-[14px] text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00ADEE]/10 focus:border-[#00ADEE] transition-all"
                    />
                    <button
                        type="submit"
                        className="w-full sm:w-auto h-[46px] rounded-[14px] px-8 bg-gradient-to-r from-[#00ADEE] to-[#0079CE] text-white font-semibold text-[14px] flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-md shadow-[#00ADEE]/10 cursor-pointer focus:outline-none shrink-0"
                    >
                        <Send className="w-4.5 h-4.5 text-white" />
                        <span>Signup</span>
                    </button>
                </form>


                <p className="text-[12.5px] text-slate-400 mb-6">
                    No spam. Unsubscribe at any time. We respect your privacy.
                </p>


                <div className="flex items-center justify-center my-6 max-w-[600px] mx-auto px-4">
                    <div className="flex-grow h-[1px] bg-slate-100"></div>
                    <span className="px-4 text-[12px] font-bold text-slate-400 uppercase tracking-widest">OR</span>
                    <div className="flex-grow h-[1px] bg-slate-100"></div>
                </div>


                <div className="max-w-[600px] mx-auto px-4">
                    <div className="bg-[#F5F8FC] border border-[#DEF5FF] rounded-[20px] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
                        <div className="flex items-center gap-4">

                            <div
                                className="w-12 h-12 bg-[#00ADEE] flex items-center justify-center text-white shrink-0 shadow-md shadow-[#00ADEE]/10"
                                style={{ borderRadius: '14px' }}
                            >
                                <MessageSquare className="w-5.5 h-5.5 text-white" />
                            </div>

                            <div className="flex flex-col text-left">
                                <h3 className="text-[15px] sm:text-[16px] font-bold text-slate-800 leading-tight">
                                    Join Our Telegram Community
                                </h3>
                                <p className="text-[12.5px] font-medium text-slate-500 mt-0.5">
                                    Receive restock alerts and updates on Telegram
                                </p>
                            </div>
                        </div>


                        <a
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto h-[40px] px-6 rounded-[12px] bg-gradient-to-r from-[#00ADEE] to-[#0079CE] hover:opacity-95 text-white font-semibold text-[13.5px] flex items-center justify-center transition-all cursor-pointer shadow-md shadow-[#00ADEE]/10 whitespace-nowrap"
                        >
                            Join Now
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default NeverMissRestock