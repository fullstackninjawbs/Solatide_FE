import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ className = "flex items-center gap-2", asColumn = false, onClick }) => {
    return (
        <Link to="/" className={className} onClick={onClick} style={{ textDecoration: 'none' }}>
            <div className="flex-shrink-0">
                <svg className={asColumn ? "h-11 w-11 mx-auto mb-1.5" : "h-9 w-9"} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="24" cy="8" r="2" fill="#0ea5e9" />
                    <circle cx="34" cy="14" r="3" fill="#1a4494" />
                    <circle cx="38" cy="24" r="2.5" fill="#0ea5e9" />
                    <circle cx="34" cy="34" r="2" fill="#1a4494" />
                    <circle cx="26" cy="40" r="3" fill="#0ea5e9" />
                    <circle cx="16" cy="14" r="1.5" fill="#1a4494" />
                    <circle cx="12" cy="24" r="2.5" fill="#0ea5e9" />
                    <circle cx="16" cy="34" r="1.5" fill="#1a4494" />
                    <circle cx="24" cy="22" r="2.5" fill="#0ea5e9" />
                    <circle cx="26" cy="30" r="1.5" fill="#1a4494" />
                    <line x1="24" y1="8" x2="34" y2="14" stroke="#1a4494" strokeWidth="0.75" />
                    <line x1="34" y1="14" x2="38" y2="24" stroke="#0ea5e9" strokeWidth="0.75" />
                    <line x1="38" y1="24" x2="34" y2="34" stroke="#1a4494" strokeWidth="0.75" />
                    <line x1="34" y1="34" x2="26" y2="40" stroke="#0ea5e9" strokeWidth="0.75" />
                    <line x1="24" y1="8" x2="16" y2="14" stroke="#1a4494" strokeWidth="0.75" />
                    <line x1="16" y1="14" x2="12" y2="24" stroke="#0ea5e9" strokeWidth="0.75" />
                    <line x1="12" y1="24" x2="16" y2="34" stroke="#1a4494" strokeWidth="0.75" />
                    <line x1="16" y1="34" x2="26" y2="40" stroke="#0ea5e9" strokeWidth="0.75" />
                    <line x1="24" y1="22" x2="16" y2="14" stroke="#0ea5e9" strokeWidth="0.75" />
                    <line x1="24" y1="22" x2="24" y2="8" stroke="#1a4494" strokeWidth="0.75" />
                    <line x1="24" y1="22" x2="34" y2="14" stroke="#0ea5e9" strokeWidth="0.75" />
                    <line x1="24" y1="22" x2="38" y2="24" stroke="#1a4494" strokeWidth="0.75" />
                    <line x1="24" y1="22" x2="26" y2="30" stroke="#0ea5e9" strokeWidth="0.75" />
                    <line x1="26" y1="30" x2="34" y2="34" stroke="#1a4494" strokeWidth="0.75" />
                    <line x1="26" y1="30" x2="16" y2="34" stroke="#0ea5e9" strokeWidth="0.75" />
                </svg>
            </div>
            <div className={`flex flex-col leading-none ${asColumn ? 'text-center' : 'text-left'}`}>
                <span className={`${asColumn ? 'text-[18px]' : 'text-[16px]'} font-extrabold tracking-widest text-[#1a4494] leading-none`}>SOLATIDE</span>
                <span className={`${asColumn ? 'text-[9px]' : 'text-[8px]'} font-bold tracking-[0.20em] text-[#0ea5e9] leading-none mt-[3px]`}>BIOSCIENCES</span>
            </div>
        </Link>
    );
};

export default Logo;
