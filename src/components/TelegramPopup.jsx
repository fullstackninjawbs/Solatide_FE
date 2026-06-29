import React, { useState } from 'react';

const TelegramPopup = () => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[60] animate-[fadeInUp_0.5s_ease-out]">
            <div className="relative bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-7 pr-12 w-[420px] max-w-[calc(100vw-32px)] border border-slate-100">
                {/* Close Button */}
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-4 right-4 w-7 h-7 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-600 transition-colors"
                    aria-label="Close"
                >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M13 1L1 13M1 1l12 12" />
                    </svg>
                </button>

                <div className="flex gap-5 items-start">
                    {/* Telegram Icon */}
                    <div className="shrink-0 pt-0.5">
                        <div className="w-[52px] h-[52px] rounded-[20px] bg-gradient-to-br from-[#00d2ff] to-[#1e3a8a] flex items-center justify-center shadow-lg">
                            <svg className="w-[26px] h-[26px] text-white transform -translate-x-[1px] translate-y-[1px]" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l.002.001-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.319-.486-1.931-1.282-1.434z" fill="#fff" />
                            </svg>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col text-left">
                        <span className="text-[11px] font-bold text-[#6A6A6A] tracking-[0.05em] uppercase mb-1">
                            Solatide Updates
                        </span>
                        <h3 className="text-[18px] font-extrabold text-[#0b1426] mb-2.5 leading-tight tracking-tight">
                            Join us on Telegram
                        </h3>
                        <p className="text-[12px] text-[#6A6A6A] mb-5 leading-[1.6]">
                            Exclusive discounts, restock alerts, batch documentation updates, and important store announcements.
                        </p>
                        <div className="flex items-center gap-4">
                            <a
                                href="#"
                                target="_blank"
                                rel="noreferrer"
                                className="bg-[#0b1426] text-white px-6 py-2.5 rounded-[99px] text-[12px] font-bold hover:bg-[#1a2b4c] transition-colors whitespace-nowrap"
                            >
                                Join Community
                            </a>
                            <button
                                onClick={() => setIsVisible(false)}
                                className="text-[13px] font-bold text-[#6A6A6A] hover:text-[#4B5563] transition-colors whitespace-nowrap"
                            >
                                Not now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TelegramPopup;
