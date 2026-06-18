import React from 'react';

const FreedomLogo = () => (
    <div className="flex flex-col items-center justify-center shrink-0 h-[70px]">
        <svg width="60" height="36" viewBox="0 0 64 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-1">
            <path d="M10 28 C20 28, 30 20, 35 15 C45 25, 55 10, 60 5" stroke="#cc2936" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M12 32 C22 32, 32 24, 37 19 C47 29, 57 14, 62 9" stroke="#cc2936" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M8 24 C18 24, 28 16, 33 11 C43 21, 53 6, 58 1" stroke="#1a4494" strokeWidth="3" fill="none" strokeLinecap="round" />
            <circle cx="16" cy="20" r="2" fill="#1a4494" />
        </svg>
        <span className="text-[18px] font-bold text-[#4B5563] tracking-[0.2em] leading-none mb-0.5">FREEDOM</span>
        <span className="text-[8px] font-semibold text-[#9CA3AF] tracking-[0.3em] leading-none">DIAGNOSTICS</span>
    </div>
);

const MetrixLogo = () => (
    <div className="flex flex-col items-center justify-center shrink-0 h-[70px]">
        <span className="text-[12px] font-extrabold text-[#1f2937] leading-none mb-1">Verified by</span>
        <div className="flex items-center gap-1.5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="6" fill="url(#rainbow)" />
                <circle cx="12" cy="12" r="6" fill="white" />
                <defs>
                    <linearGradient id="rainbow" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FF0000" />
                        <stop offset="0.3" stopColor="#FF7F00" />
                        <stop offset="0.5" stopColor="#FFFF00" />
                        <stop offset="0.7" stopColor="#00FF00" />
                        <stop offset="1" stopColor="#0000FF" />
                    </linearGradient>
                </defs>
            </svg>
            <span className="text-[20px] font-bold text-[#1f2937] leading-none tracking-tight">
                <span className="text-[#0ea5e9]">Metrix</span>.bio
            </span>
        </div>
    </div>
);

const TrustpilotLogo = () => (
    <div className="flex items-center gap-2 shrink-0 h-[70px]">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#00b67a" />
        </svg>
        <span className="text-[24px] font-bold text-[#1f2937] tracking-tight">Trustpilot</span>
    </div>
);

const IsoLogo = () => (
    <div className="flex items-center justify-center w-[70px] h-[70px] bg-[#0070c0] shrink-0 relative overflow-hidden rounded-md">
        <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute opacity-60">
            <circle cx="50" cy="50" r="45" stroke="white" strokeWidth="2" fill="none" />
            <path d="M50 5 C75 5, 95 25, 95 50 C95 75, 75 95, 50 95 C25 95, 5 75, 5 50 C5 25, 25 5, 50 5 Z" stroke="white" strokeWidth="1" fill="none" />
            <line x1="5" y1="50" x2="95" y2="50" stroke="white" strokeWidth="2" />
            <line x1="50" y1="5" x2="50" y2="95" stroke="white" strokeWidth="2" />
            <ellipse cx="50" cy="50" rx="20" ry="45" stroke="white" strokeWidth="2" fill="none" />
            <ellipse cx="50" cy="50" rx="45" ry="20" stroke="white" strokeWidth="2" fill="none" />
        </svg>
        <span className="text-[28px] font-black text-white relative z-10 tracking-tighter">ISO</span>
    </div>
);

const GmpLogo = () => (
    <div className="flex items-center justify-center shrink-0 h-[70px]">
        <svg width="70" height="70" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="48" stroke="#4caf50" strokeWidth="3" fill="white" />
            <circle cx="50" cy="50" r="43" stroke="#4caf50" strokeWidth="1" fill="white" strokeDasharray="2 2" />
            <circle cx="50" cy="50" r="35" stroke="#4caf50" strokeWidth="2" fill="none" />
            <path id="curve" d="M 15 50 A 35 35 0 1 1 85 50 A 35 35 0 1 1 15 50" fill="transparent" />
            <text width="100" className="text-[8px] font-bold fill-[#4caf50] tracking-widest">
                <textPath href="#curve" startOffset="50%" textAnchor="middle">
                    GOOD MANUFACTURING PRACTICE
                </textPath>
            </text>
            <text x="50" y="52" className="text-[22px] font-black fill-[#4caf50]" textAnchor="middle" dominantBaseline="middle">GMP</text>
            <text x="50" y="65" className="text-[7px] font-bold fill-[#4caf50]" textAnchor="middle">CERTIFIED</text>
        </svg>
    </div>
);

const JanoshikLogo = () => (
    <div className="flex flex-col items-center justify-center shrink-0 h-[70px]">
        <svg width="60" height="36" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-1">
            <rect x="5" y="14" width="4" height="10" fill="#a3e635" />
            <rect x="13" y="10" width="4" height="14" fill="#a3e635" />
            <rect x="21" y="6" width="4" height="18" fill="#a3e635" />
            <path d="M2 18 L10 12 L18 8 L28 2" stroke="#4ade80" strokeWidth="2" fill="none" />
            <circle cx="28" cy="2" r="2" fill="#22c55e" />
        </svg>
        <span className="text-[18px] font-bold tracking-widest leading-none">
            <span className="text-[#374151]">JANO</span>
            <span className="text-[#84cc16]">SHIK</span>
        </span>
    </div>
);

const TrustBanner = () => {
    const baseLogos = [
        <FreedomLogo key="freedom" />,
        <MetrixLogo key="metrix" />,
        <TrustpilotLogo key="trust" />,
        <IsoLogo key="iso" />,
        <GmpLogo key="gmp" />,
        <JanoshikLogo key="jano" />,
    ];
    const allLogos = [...Array(4)].flatMap((_, setIdx) =>
        baseLogos.map((logo, logoIdx) =>
            React.cloneElement(logo, { key: `logo-${setIdx}-${logoIdx}` })
        )
    );

    return (
        <section className="w-full bg-white overflow-hidden py-8 relative z-10">
            <div className="flex w-max shrink-0 animate-marquee-four-sets hover:[animation-play-state:paused] cursor-pointer gap-16 px-8 md:gap-24 md:px-12">
                {allLogos}
            </div>
        </section>
    );
};

export default TrustBanner;
