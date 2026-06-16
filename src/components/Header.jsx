import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Header = () => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Mapped exactly to the visible links in the screenshot
    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/shop' },
        { name: 'COA & Testing', path: '/coa' },
        { name: 'Calculator', path: '/calculator' },
        { name: 'FAQ', path: '/faq' },
        { name: 'Contact Us', path: '/contact' }
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
            <div className="main-container">



                <div className="flex h-20 items-center justify-between gap-4">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="flex-shrink-0">
                                <svg className="h-10 w-10" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                            <div className="flex flex-col">
                                <span className="text-lg font-bold tracking-wider text-[#1a4494] leading-none">SOLATIDE</span>
                                <span className="text-[9px] font-bold tracking-[0.18em] text-[#0ea5e9] leading-none mt-1">BIOSCIENCES</span>
                            </div>
                        </Link>
                    </div>

                    <nav className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${isActive(link.path)
                                    ? 'bg-[#1a4494] text-white px-5 py-2.5 shadow-sm'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Right side controls (Search + Contact CTA + Cart icon) */}
                    <div className="hidden lg:flex items-center gap-3">
                        {/* Rounded Search input with blue border */}
                        <div className="relative flex items-center bg-white border border-[#1a4494] rounded-full px-3.5 py-1.5 w-52 focus-within:w-60 transition-all duration-300">
                            <svg className="h-4 w-4 text-[#1a4494] mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full bg-transparent border-0 p-0 text-slate-800 placeholder-slate-400 text-sm focus:ring-0 focus:outline-none"
                            />
                        </div>

                        {/* Blue capsule Contact Us button */}
                        <Link
                            to="/contact"
                            className="inline-flex items-center justify-center rounded-full bg-[#1a4494] px-6 py-2.5 text-sm font-bold text-white hover:bg-sky-800 transition-colors shadow-sm"
                        >
                            Contact Us
                        </Link>

                        {/* Circular Cart icon with blue border & badge */}
                        <button className="relative h-10 w-10 rounded-full border border-[#1a4494] flex items-center justify-center text-[#1a4494] bg-white hover:bg-slate-50 transition-colors shrink-0">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#1a4494] text-[9px] font-bold text-white border border-white">0</span>
                        </button>
                    </div>

                    {/* Mobile Menu Action bar */}
                    <div className="flex lg:hidden items-center gap-3">
                        <button className="relative h-9 w-9 rounded-full border border-[#1a4494] flex items-center justify-center text-[#1a4494] bg-white shrink-0">
                            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#1a4494] text-[9px] font-bold text-white">0</span>
                        </button>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>


                {/* Mobile menu panel */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-1 shadow-inner">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`block px-4 py-2.5 text-base font-semibold rounded-lg transition-colors ${isActive(link.path)
                                    ? 'bg-[#1a4494] text-white'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="pt-4 border-t border-slate-100 mt-2">
                            <Link
                                to="/contact"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex w-full items-center justify-center rounded-lg bg-[#1a4494] py-3 text-base font-semibold text-white hover:bg-sky-800 transition-colors"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}

export default Header